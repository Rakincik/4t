"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

export type CartItem = {
  id: string; // courseId/slug
  slug: string;
  title: string;
  imageUrl?: string;
  category?: string;
  price: number; // discounted
  originalPrice?: number;
  qty: number; // genelde 1
  isCouponApplicable?: boolean;
  variantId?: string;
  selectedAddonIds?: string[];
  isInstallmentApplicable?: boolean;
};

type CartState = {
  items: CartItem[];
  coupon?: { 
    code: string; 
    type: string; 
    amount: number; 
    courseId: string | null; 
    variantId: string | null;
    excludedCourseIds?: string[] | null;
    excludedVariantIds?: string[] | null;
  };
};

type CartActions =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "CLEAR" }
  | { type: "APPLY_COUPON"; payload: { 
      code: string; 
      type: string; 
      amount: number; 
      courseId: string | null; 
      variantId: string | null;
      excludedCourseIds?: string[] | null;
      excludedVariantIds?: string[] | null;
    } }
  | { type: "REMOVE_COUPON" }
  | { type: "OPEN" }
  | { type: "CLOSE" };

type CartContextValue = {
  state: CartState;
  subtotal: number;
  discount: number; // şimdilik 0 (kupon vs sonra)
  total: number;

  isOpen: boolean;
  open: () => void;
  close: () => void;

  add: (item: CartItem, opts?: { openDrawer?: boolean }) => void;
  remove: (id: string) => void;

  setQty: (id: string, qty: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;

  clear: () => void;
  applyCoupon: (coupon: { 
    code: string; 
    type: string; 
    amount: number; 
    courseId: string | null; 
    variantId: string | null;
    excludedCourseIds?: string[] | null;
    excludedVariantIds?: string[] | null;
  }) => void;
  removeCoupon: () => void;
};

const LS_KEY = "cart:v1";
const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number) {
  // qty 0 => remove mantığını reducer içinde yapıyoruz
  return Math.max(0, Math.min(99, Number.isFinite(qty) ? qty : 1));
}

function reducer(state: CartState, action: CartActions): CartState {
  switch (action.type) {
    case "HYDRATE": {
      const safe = action.payload && Array.isArray(action.payload.items)
        ? {
            items: action.payload.items
              .filter((x) => x && typeof x.id === "string")
              .map((x) => ({
                ...x,
                qty: Math.max(1, Math.min(99, x.qty || 1)),
              })),
            coupon: action.payload.coupon || undefined,
          }
        : { items: [], coupon: undefined };

      return safe;
    }

    case "ADD": {
      const incoming = {
        ...action.payload,
        qty: 1,
      };

      const exists = state.items.find((x) => x.id === incoming.id);
      if (exists) {
        // Zaten sepette varsa miktarını artırmıyoruz, mevcut durumu koruyoruz
        return state;
      }
      return { ...state, items: [incoming, ...state.items] };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((x) => x.id !== action.id) };

    case "SET_QTY": {
      return {
        ...state,
        items: state.items.map((x) =>
          x.id === action.id ? { ...x, qty: 1 } : x
        ),
      };
    }

    case "INC": {
      return state; // Miktar artırılamaz
    }

    case "DEC": {
      return state; // Miktar azaltılamaz
    }

    case "CLEAR":
      return { items: [], coupon: undefined };

    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };

    case "REMOVE_COUPON":
      return { ...state, coupon: undefined };

    // OPEN/CLOSE reducer'a eklendi (istersen dispatch ile de kullan)
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    coupon: undefined,
  });
  const [isOpen, setIsOpen] = useState(false);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartState;
      dispatch({ type: "HYDRATE", payload: parsed });
    } catch {
      // ignore
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const subtotal = useMemo(
    () => state.items.reduce((s, x) => s + x.price * x.qty, 0),
    [state.items]
  );

  const discountableAmount = useMemo(() => {
    if (!state.coupon) return 0;
    return state.items.reduce((s, x) => {
      if (x.isCouponApplicable === false) return s;

      // ID'yi normalize et (Flix ögeleri için)
      let courseId = x.id;
      let variantId = x.variantId || null;
      if (x.id.startsWith("flix-")) {
        const parts = x.id.split("-");
        courseId = parts[1];
        variantId = parts[2] || null;
      }

      let matches = true;
      if (state.coupon.courseId) {
        if (courseId !== state.coupon.courseId) {
          matches = false;
        } else if (state.coupon.variantId && variantId !== state.coupon.variantId) {
          matches = false;
        }
      } else {
        // Global kuponlar için hariç tutulanları kontrol et
        const excludedCourses = (state.coupon.excludedCourseIds as string[]) || [];
        const excludedVariants = (state.coupon.excludedVariantIds as string[]) || [];
        if (excludedCourses.includes(courseId)) {
          matches = false;
        } else if (variantId && excludedVariants.includes(variantId)) {
          matches = false;
        }
      }

      return s + (matches ? x.price * x.qty : 0);
    }, 0);
  }, [state.items, state.coupon]);

  let discount = 0;
  if (state.coupon) {
      if (state.coupon.type === "PERCENT") {
          discount = (discountableAmount * state.coupon.amount) / 100;
      } else {
          discount = state.coupon.amount;
      }
      if (discount > discountableAmount) discount = discountableAmount;
  }
  const total = Math.max(0, subtotal - discount);

  const value: CartContextValue = {
    state,
    subtotal,
    discount,
    total,

    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),

    add: (item, opts) => {
      dispatch({ type: "ADD", payload: item });
      if (opts?.openDrawer) setIsOpen(true);
    },

    remove: (id) => dispatch({ type: "REMOVE", id }),

    setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
    inc: (id) => dispatch({ type: "INC", id }),
    dec: (id) => dispatch({ type: "DEC", id }),

    clear: () => dispatch({ type: "CLEAR" }),
    applyCoupon: (coupon) => dispatch({ type: "APPLY_COUPON", payload: coupon }),
    removeCoupon: () => dispatch({ type: "REMOVE_COUPON" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
