/* ---------- Add to cart ---------- */

function addToCart(productId) {
    $.ajax({
        url: '/add-to-cart/' + productId,
        method: 'get',
        success: (response) => {
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $('#cart-count').html(count)
            }
        }
    })
}


/* ---------- Change product quantity ---------- */

function changeQuantity(cartId, productId,userId, count) {
    let quantity = parseInt(document.getElementById(productId).innerHTML)
    count = parseInt(count)
    $.ajax({
        url: '/change-product-quantity',

        data: {
            cart: cartId,
            product: productId,
            user:userId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert("Product removed from cart ")
            }
            location.reload()

        }
    });
}

/* ---------- Remove cart product---------- */

function removeProduct(cartId,productId) {
    $.ajax({
        url: '/remove-product',
        data: {
            cart: cartId,
            product: productId
        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert("Product Removed Successfully")
            }
            location.reload()

        }
    })
}

/* ------------- Place Order ------------- */
$("#checkout-form").submit((e)=>{
    e.preventDefault()
    $.ajax({
        url:'/place-order',
        method:'post',
        data:$('#checkout-form').serialize(),
        success:(response)=>{
            // alert(response)
            if(response.codSuccess){
                location.href='\order-success'
            }else{
                razorpayPayment(response)
            }
        }
    })
})

/* ------------- Razorpay Payment ------------- */
/*function razorpayPayment(order){
    var options = {
        "key": "rzp_test_YvyMMUHgr4kUjQ", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "First Test",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)

            verifyPayment(response)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();

}*/
    function verifyPayment(payment,order){
        $.ajax({
            url:'/verify-payment',
            data:{
                payment,
                order
            },
            method:'post'
        })
    }











