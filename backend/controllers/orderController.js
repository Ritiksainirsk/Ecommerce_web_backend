const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHander = require("../utils/errorHandler");

// create order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const orders = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    orders,
  });
});


// get All orders -- Admin
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.findById(req.params.id).populate("user","name email")

  if (!orders) {
    return next(new ErrorHander("Order not fount with this id", 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});


// get logged in user Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const Orders = await Order.find({ user: req.user._id });

  if (!Orders) {
    return next(new ErrorHander("Order not fount with this id", 404));
  }

  res.status(200).json({
    success: true,
    Orders,
  });
});


// get All orders -- Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  if (!orders) {
    return next(new ErrorHander("Order not fount with this id", 404));
  }

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Orders status -- admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if(!order){
    return next(new ErrorHander("Order not fount with this id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this Order", 404));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}



// delete product --Admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id)

  if(!order){
    return next(new ErrorHander("Order not fount with this id", 404));
  }

  await order.deleteOne({})

  res.status(200).json({
    success:true,
  })
})

