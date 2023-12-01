const Order = require('../models/order.model');
const User = require('../models/user.model');
const stripe = require("stripe")('sk_test_51NCgZhSGLp42UHm4pPgngGPHKynyCkkbe8oH7mFwVyGt6TozUodCPX6I3B1yLj9J6Czuah6wD88B2uQKGyo31EHH00kG40YstW');
async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;
  console.log(cart)

  const session = await stripe.checkout.sessions.create({
    payment_method_types:[
      'card',
    ],
    line_items: [{
      price_data: {
        currency: 'INR',
        product_data: {
          name: 'all items',
        },
        unit_amount: ((cart.totalPrice)*100)/cart.totalQuantity,
      },
      quantity: cart.totalQuantity,
    }],
    phone_number_collection: {
      enabled: true,
    },
    mode:'payment',
    success_url:'http://localhost:9000/orders/success',
    cancel_url:'http://localhost:9000/orders/failure'
  });
  res.redirect(303,session.url);
}
function getSuccess(req,res){
  res.render('customer/orders/success')
}
function getFailure(req,res){
  res.render('customer/orders/failture')
}
module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess:getSuccess,
  getFailure:getFailure
};
