$(document).ready(function() {
    let url = 'http://rem-rest-api.herokuapp.com/api/iury';
    let urlUsuarios = url + "-usuarios";
    let urlCompras = url + "-compras";

    function getProductById(id) {
        for(i = 0; i < productsList.length; i++) {
            if(productsList[i].id == id)
                return productsList[i];
        }
        return null;
    }

    function preencher() {
        let userLoggedId = localStorage.getItem("id");
        $.ajax({
            type: 'GET',
            url: urlCompras,
            xhrFields: {
                withCredentials: true
            },
            success: function (results) {
                $.each(results.data, function(key, val) {
                    let productsIds = JSON.parse(val.products);
                    let productsQtds = JSON.parse(val.qtds);
                    let userId = val.userId;
                    var date = val.date;
                    if (userId == userLoggedId) {
                        $.each(productsIds, function(key, productId) {
                            let product = getProductById(productId);
                            
                            let productDetails = $("#realizadas-product-details").clone();
                            productDetails.attr("id", "");
                            productDetails.find(".realizadas-product-name").html(product.nome);
                            productDetails.find(".realizadas-price span").html("R$ " + product.valor + ",00");
                            productDetails.find(".realizadas-price-total span").html("R$ " + (product.valor * productsQtds[key]) + ",00");
                            productDetails.find(".realizadas-qtd span").html(productsQtds[key]);
                            productDetails.find(".realizadas-date span").html(date);

                            console.log(productDetails);

                            $("#realizadas-products").append(productDetails);
                        });
                    }
                })
                $("#realizadas-product-details").hide();
            }, error: function (err) {
                console.log(err);
            }
        });
    }

    preencher();
});