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
$("#checkout-form").submit((event)=>{
    event.preventDefault()
    $.ajax({
        url:'/place-order',
        method:'post',
        data:$('#checkout-form').serialize(),
        success:(response)=>{
            // alert(response)
            if(response.status){
                location.href='\order-success'
            }
        }
    })
})
