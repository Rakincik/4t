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
};

type CartState = {
  items: CartItem[];
  couponCode?: string;
};

type CartActions =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "CLEAR" }
  | { type: "SET_COUPON"; code: string }
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
  setCoupon: (code: string) => void;
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
            couponCode: action.payload.couponCode?.trim() || undefined,
          }
        : { items: [], couponCode: undefined };

      return safe;
    }

    case "ADD": {
      const incoming = {
        ...action.payload,
        qty: Math.max(1, Math.min(99, action.payload.qty || 1)),
      };

      const exists = state.items.find((x) => x.id === incoming.id);
      if (exists) {
        // qty arttırma istiyorsun => aynı ürüne +1 gibi davranır
        return {
          ...state,
          items: state.items.map((x) =>
            x.id === incoming.id
              ? { ...x, qty: Math.min(99, x.qty + incoming.qty) }
              : x
          ),
        };
      }
      return { ...state, items: [incoming, ...state.items] };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((x) => x.id !== action.id) };

    case "SET_QTY": {
      const nextQty = clampQty(action.qty);

      // 0 => remove (UX: eksiye basınca 0 olursa silinsin)
      if (nextQty <= 0) {
        return { ...state, items: state.items.filter((x) => x.id !== action.id) };
      }

      return {
        ...state,
        items: state.items.map((x) =>
          x.id === action.id ? { ...x, qty: Math.max(1, nextQty) } : x
        ),
      };
    }

    case "INC": {
      const it = state.items.find((x) => x.id === action.id);
      if (!it) return state;
      return {
        ...state,
        items: state.items.map((x) =>
          x.id === action.id ? { ...x, qty: Math.min(99, x.qty + 1) } : x
        ),
      };
    }

    case "DEC": {
      const it = state.items.find((x) => x.id === action.id);
      if (!it) return state;

      const next = it.qty - 1;
      if (next <= 0) {
        return { ...state, items: state.items.filter((x) => x.id !== action.id) };
      }

      return {
        ...state,
        items: state.items.map((x) =>
          x.id === action.id ? { ...x, qty: Math.max(1, next) } : x
        ),
      };
    }

    case "CLEAR":
      return { items: [], couponCode: undefined };

    case "SET_COUPON":
      return { ...state, couponCode: action.code.trim() || undefined };

    // OPEN/CLOSE reducer'a eklendi (istersen dispatch ile de kullan)
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    couponCode: undefined,
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

  // kupon/indirim sonra
  const discount = 0;
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
    setCoupon: (code) => dispatch({ type: "SET_COUPON", code }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
