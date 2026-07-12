// src/lib/gtag.ts

type GAEventItem = {
  id: string;
  title: string;
  price: number;
  qty?: number;
  category?: string;
};

// Safe gtag wrapper
const runGtag = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

// Safe fbq wrapper
const runFbq = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq(...args);
  }
};

export const logViewItem = (item: GAEventItem) => {
  runGtag("event", "view_item", {
    currency: "TRY",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: item.qty || 1,
        item_category: item.category || "Course"
      }
    ]
  });

  runFbq("track", "ViewContent", {
    content_name: item.title,
    content_ids: [item.id],
    content_type: "product",
    value: item.price,
    currency: "TRY"
  });
};

export const logAddToCart = (item: GAEventItem) => {
  runGtag("event", "add_to_cart", {
    currency: "TRY",
    value: item.price * (item.qty || 1),
    items: [
      {
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: item.qty || 1,
        item_category: item.category || "Course"
      }
    ]
  });

  runFbq("track", "AddToCart", {
    content_name: item.title,
    content_ids: [item.id],
    content_type: "product",
    value: item.price,
    currency: "TRY"
  });
};

export const logRemoveFromCart = (item: GAEventItem) => {
  runGtag("event", "remove_from_cart", {
    currency: "TRY",
    value: item.price * (item.qty || 1),
    items: [
      {
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: item.qty || 1,
        item_category: item.category || "Course"
      }
    ]
  });
};

export const logViewCart = (items: GAEventItem[], total: number) => {
  runGtag("event", "view_cart", {
    currency: "TRY",
    value: total,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.qty || 1,
      item_category: item.category || "Course"
    }))
  });
};

export const logBeginCheckout = (items: GAEventItem[], total: number) => {
  runGtag("event", "begin_checkout", {
    currency: "TRY",
    value: total,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.qty || 1,
      item_category: item.category || "Course"
    }))
  });

  runFbq("track", "InitiateCheckout", {
    value: total,
    currency: "TRY"
  });
};

export const logPurchase = (transactionId: string, items: GAEventItem[], total: number, coupon?: string) => {
  runGtag("event", "purchase", {
    transaction_id: transactionId,
    value: total,
    currency: "TRY",
    coupon: coupon || "",
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.qty || 1,
      item_category: item.category || "Course"
    }))
  });

  runFbq("track", "Purchase", {
    value: total,
    currency: "TRY",
    content_ids: items.map(i => i.id),
    content_type: "product"
  });
};

export const logGenerateLead = (method: string, category: string = "Contact Form") => {
  runGtag("event", "generate_lead", {
    currency: "TRY",
    value: 0,
    lead_type: category,
    method: method
  });

  runFbq("track", "Lead", {
    content_category: category,
    value: 0,
    currency: "TRY"
  });
};
