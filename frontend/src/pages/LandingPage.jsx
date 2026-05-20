import React from 'react';
import { motion } from 'framer-motion';
import { Button, BrandMark, Card } from '../components/UI';

export const LandingPage = () => {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&s=')] bg-cover bg-center filter brightness-75"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">Fresh Meals. Warm Moments. Delivered Beautifully.</h2>
              <p className="text-beige max-w-xl mb-6">Experience the art of dining with seasonal ingredients crafted by our chefs. Dine-in or take away — every meal is a moment.</p>

              <div className="flex gap-4">
                <Button variant="primary" size="lg">Order Now</Button>
                <Button variant="secondary" size="lg">Reserve Table</Button>
              </div>
            </motion.div>

            <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9 }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1543353071-087092ec3930?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Signature" className="w-full h-72 object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Signature Meals */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-charcoal mb-6">Signature Meals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i)=> (
            <Card key={i} className="flex flex-col gap-4">
              <div className="h-44 rounded-lg overflow-hidden">
                <img src={`https://images.unsplash.com/photo-15${i}...`} alt="dish" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Dish Name {i}</h4>
                <p className="text-softgray text-sm">A short evocative description about the flavor and origin.</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-wine font-bold">GHS 12.50</div>
                  <Button variant="outline" size="sm">Add</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-charcoal mb-6">What Our Guests Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map((i)=> (
              <Card key={i} className="p-6">
                <p className="text-softgray">“A lovely meal that felt like home. The service was impeccable and the flavors were unforgettable.”</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-beige" />
                  <div>
                    <div className="font-semibold">Guest {i}</div>
                    <div className="text-sm text-softgray">Verified Diner</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 text-softgray">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <BrandMark className="w-40" imgClassName="w-full" />
            <p className="text-sm">A warm dining experience crafted with care.</p>
          </div>

          <div className="text-sm">© {new Date().getFullYear()} All rights reserved</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
