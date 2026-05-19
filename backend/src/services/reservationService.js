const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { ApiError } = require('../utils/apiResponse');

class ReservationService {
  async createReservation(data) {
    const { tableId, reservationTime, guests } = data;

    // Check table exists
    const table = await Table.findById(tableId);
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    if (table.capacity < guests) {
      throw new ApiError(400, `Table capacity is ${table.capacity}, but ${guests} guests requested`);
    }

    // Check for conflicts (prevent double booking)
    const conflictingReservations = await Reservation.findOne({
      table: tableId,
      status: { $in: ['pending', 'confirmed'] },
      reservationTime: {
        $gte: new Date(new Date(reservationTime).getTime() - 2 * 60 * 60 * 1000),
        $lte: new Date(new Date(reservationTime).getTime() + 2 * 60 * 60 * 1000),
      },
    });

    if (conflictingReservations) {
      throw new ApiError(400, 'Table is already reserved for this time slot');
    }

    const reservation = await Reservation.create({
      ...data,
      table: tableId,
      reservationTime: new Date(reservationTime),
    });

    // Update table status to reserved
    await Table.findByIdAndUpdate(tableId, {
      status: 'reserved',
      currentReservation: reservation._id,
    });

    return reservation.populate('table');
  }

  async getAllReservations(filters = {}) {
    const query = { status: { $ne: 'cancelled' } };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.dateRange) {
      query.reservationTime = {
        $gte: new Date(filters.dateRange.start),
        $lte: new Date(filters.dateRange.end),
      };
    }

    return await Reservation.find(query)
      .populate('table')
      .sort({ reservationTime: 1 });
  }

  async getReservationById(reservationId) {
    const reservation = await Reservation.findById(reservationId).populate('table');

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    return reservation;
  }

  async updateReservation(reservationId, updateData) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    if (reservation.status === 'completed' || reservation.status === 'cancelled') {
      throw new ApiError(400, 'Cannot update a completed or cancelled reservation');
    }

    Object.assign(reservation, updateData);
    await reservation.save();

    return reservation.populate('table');
  }

  async confirmReservation(reservationId) {
    return await Reservation.findByIdAndUpdate(
      reservationId,
      { status: 'confirmed' },
      { new: true }
    ).populate('table');
  }

  async completeReservation(reservationId) {
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status: 'completed' },
      { new: true }
    );

    // Free the table
    await Table.findByIdAndUpdate(reservation.table, {
      status: 'available',
      currentReservation: null,
    });

    return reservation;
  }

  async cancelReservation(reservationId) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Free the table if it's the same
    if (reservation.table) {
      const table = await Table.findById(reservation.table);
      if (table && table.currentReservation?.toString() === reservationId) {
        await Table.findByIdAndUpdate(reservation.table, {
          status: 'available',
          currentReservation: null,
        });
      }
    }

    return reservation;
  }

  async deleteReservation(reservationId) {
    const reservation = await Reservation.findByIdAndDelete(reservationId);

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    // Free the table
    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, {
        status: 'available',
        currentReservation: null,
      });
    }

    return reservation;
  }

  async getUpcomingReservations() {
    return await Reservation.find({
      status: { $in: ['pending', 'confirmed'] },
      reservationTime: { $gte: new Date() },
    })
      .populate('table')
      .sort({ reservationTime: 1 });
  }
}

module.exports = new ReservationService();
