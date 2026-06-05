const STORAGE_KEY = 'dinein.receiptConfig';

export const getDefaultReceiptConfig = () => ({
  name: import.meta.env.VITE_RESTAURANT_NAME || 'DINE-IN RESTAURANT',
  tagline: import.meta.env.VITE_RESTAURANT_TAGLINE || 'Premium Hospitality Operations',
  address: import.meta.env.VITE_RESTAURANT_ADDRESS || 'Accra, Ghana',
  phone: import.meta.env.VITE_RESTAURANT_PHONE || '+233 000 000 000',
  footerNote:
    import.meta.env.VITE_RECEIPT_FOOTER_NOTE ||
    'Thank you for dining with us. Please come again.',
});

export const getReceiptConfig = () => {
  const defaults = getDefaultReceiptConfig();

  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw);

    return {
      name: parsed.name || defaults.name,
      tagline: parsed.tagline || defaults.tagline,
      address: parsed.address || defaults.address,
      phone: parsed.phone || defaults.phone,
      footerNote: parsed.footerNote || defaults.footerNote,
    };
  } catch {
    return defaults;
  }
};

export const saveReceiptConfig = (config) => {
  if (typeof window === 'undefined') {
    return;
  }

  const normalized = {
    name: (config.name || '').trim(),
    tagline: (config.tagline || '').trim(),
    address: (config.address || '').trim(),
    phone: (config.phone || '').trim(),
    footerNote: (config.footerNote || '').trim(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
};

export const resetReceiptConfig = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};
