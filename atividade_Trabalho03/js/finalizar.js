$(document).ready(function() {
    let url = 'http://rem-rest-api.herokuapp.com/api/iury';
    let urlUsuarios = url + "-usuarios";
    let urlCompras = url + "-compras";


    function loadProducts() {
        var valorTotal = 0;
        var productsInCard = JSON.parse(localStorage.getItem('products'));
        if(productsInCard != null) {
            $.each(productsInCard, function(key, value) {
                let productDetails = $("#finish-product-details").clone();
                productDetails.attr("id", "");
                productDetails.find(".finish-product-name").html(value.nome);
                productDetails.find(".finish-price span").html("R$ " + value.valor + ",00");
                productDetails.find(".finish-price-total span").html("R$ " + (value.valor * value.qtd) + ",00");
                productDetails.find(".finish-qtd span").html(value.qtd);
                valorTotal += (value.valor * value.qtd);

                $("#finishing-products").append(productDetails);
            })
        }
        $("#finish-product-details").hide();
        $(".total-value span").html(valorTotal);
    }

    $(".finish-shopping").click(function() {
        var productsInCard = JSON.parse(localStorage.getItem('products'));

        if(productsInCard != null) {
            let userId = localStorage.getItem("id");

            let productsId = [];
            let productsQtd = [];
            $.each(productsInCard, function(key, product) {
                productsId.push(product.id);
                productsQtd.push(parseInt(product.qtd));
            });
            var today = new Date();
            var datestring = today.getDate()  + "/" + (today.getMonth()+1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes();
            $.ajax({
                type: 'POST',
                url: urlCompras,
                data: JSON.stringify({
                    userId: parseInt(userId),
                    products: JSON.stringify(productsId),
                    qtds: JSON.stringify(productsQtd),
                    date: datestring
                }),
                xhrFields: {
                    withCredentials: true
                },
                success: function (results) {
                    localStorage.removeItem("products");
                    window.location = "./index.html";
                }, error: function (err) {
                    console.log(err);
                }
            });
        }
    });

    loadProducts();
});