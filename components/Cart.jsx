import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "../ecommerce/lib/client";
import getStripe from "../ecommerce/lib/getStripe";

const Cart = () => {
  const cartRef = useRef();
  const {
    setShowCart,
    totalPrice,
    totalQuantities,
    cartItems,
    togggleCartItemQuantity,
    onRemove,
  } = useStateContext();
  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();
    console.log(data);
    toast.loading("Redirecting...");

    stripe.redirectToCheckout({ sessionId: data.id });
  };
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities}) items</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your Shopping bag is emty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>Kshs. {item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <p className="quantity-desc">
                      <span
                        className="minus"
                        onClick={() =>
                          togggleCartItemQuantity(item._id, "decrease")
                        }
                      >
                        <AiOutlineMinus />
                      </span>
                      <span className="num">{item.quantity}</span>
                      <span
                        className="plus"
                        onClick={() =>
                          togggleCartItemQuantity(item._id, "increase")
                        }
                      >
                        <AiOutlinePlus />
                      </span>
                    </p>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          <div>
            {cartItems.length >= 1 && (
              <div className="cart-bottom">
                <div className="total">
                  <h3>Subtotal:</h3>
                  <h3>Kshs. {totalPrice}</h3>
                </div>
                <div className="btm-container">
                  <button
                    className="btn"
                    type="button"
                    onClick={handleCheckout}
                  >
                    Pay With Stripe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
