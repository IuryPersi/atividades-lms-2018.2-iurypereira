var productsList = [
    {
        "id": 1,
        "nome": "iPhone X",
        "valor": 5000,
        "imagem": "iphonex.jpeg",
        "qtd": 0
    },
    {
        "id": 2,
        "nome": "Samsung S9",
        "valor": 5000,
        "imagem": "s9-600x600.png",
        "qtd": 0
    },
    {
        "id": 3,
        "nome": "Asus",
        "valor": 5000,
        "imagem": "asus.jpg",
        "qtd": 0
    },
    {
        "id": 4,
        "nome": "LG K10",
        "valor": 5000,
        "imagem": "k10.jpg",
        "qtd": 0
    }
]


$(document).ready(function () {
    let url = 'http://rem-rest-api.herokuapp.com/api/iury';
    let urlUsuarios = url + "-usuarios";

    function fillList() {
        $("#post-result").empty();
        
        var productsInCard = JSON.parse(localStorage.getItem('products'));
        if(productsInCard != null) {
            for (let i = 0; i < productsInCard.length; i++) {
                var productDetails = productsInCard[i].nome + " " + productsInCard[i].qtd + " " + productsInCard[i].valor;
                let li = $("<li></li>").text(productDetails);

                $("#post-result").append(li);
            }
        }
    }

    fillList();

    function preencher() {
        $.each(productsList, function(key, value) {
            let productDetails = $("#product-details").clone();
            productDetails.find(".product-name").html(value.nome);
            productDetails.find(".valor-produto").html("R$ " + value.valor + ",00");
            productDetails.find(".product-image").attr("src", "img/"+ value.imagem);
            productDetails.find(".botao-add").attr("data-id", value.id);
            productDetails.find(".qtd-product").addClass("product-qtd-" + value.id);
            productDetails.attr("id", "");

            $("#products").append(productDetails);
        });
        $("#product-details").hide();
    }
    preencher();

    function getProductById(id) {
        for(i = 0; i < productsList.length; i++) {
            if(productsList[i].id == id)
                return productsList[i];
        }
        return null;
    }

    $(".botao-add").click(function(ev) {
        ev.preventDefault();
        let id = $(this).attr("data-id");
        let product = getProductById(id);
        let qtd = $(".product-qtd-" + id).val();
        product.qtd = qtd;
        storeProductToCard(product);
    });

    function storeProductToCard(product) {
        var productsInCard = JSON.parse(localStorage.getItem('products'));
        if(productsInCard != null)
            productsInCard.push(product);
        else
            productsInCard = [product];

        localStorage.setItem('products', JSON.stringify(productsInCard));
        fillList();
    }
    
    
    
    $("#logout").click(function () {
        localStorage.removeItem("login");
        console.log(localStorage);
        $("#logout").css("display", "none");
        $("#login").css("display", "block");
    
    });

    function usuarioExiste(user) {
        var exists = false;
        $.ajax({
            type: 'GET',
            url: urlUsuarios,
            async: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (results) {
                $.each(results.data, function(key, val) {
                    if (user == val.user) {
                        exists = true;
                    }
                })
            }, error: function (err) {
                console.log(err);
            }
        });
        return exists;
    }

    function autenticar(user, senha) {
        var exists = false;
        $.ajax({
            type: 'GET',
            url: urlUsuarios,
            async: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (results) {
                $.each(results.data, function(key, val) {
                    if (user == val.user && senha == val.password) {
                        exists = true;

                        localStorage.setItem("id", val.id);
                        localStorage.setItem("user", val.user);

                        verifica();
                    }
                })
            }, error: function (err) {
                console.log(err);
            }
        });
        return exists;
    }

    $(".cadastro input[type='submit']").click(function(ev) {
        ev.preventDefault();

        var usuario = $(".cadastro .login").val();
        var senha = $(".cadastro .senha").val();
        
        if(!usuarioExiste(usuario)) {
            $.ajax({
                type: 'POST',
                url: urlUsuarios,
                data: JSON.stringify({
                    user: usuario,
                    password: senha
                }),
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    alert("Cadastrado com sucesso");
                }, error: function (err) {
                    console.log(err);
                }
            });
        } else {
            alert("Usuário já está cadastrado");
        }
    });

    $(".login-form input[type='submit']").click(function(ev) {
        ev.preventDefault();

        var usuario = $(".login-form .login").val();
        var senha = $(".login-form .senha").val();
        
        if(autenticar(usuario, senha)) {
           alert("Logou"); 
        } else {
            alert("Erro ao realizar login");
        }
    });

    $("#logout").click(function() {
        localStorage.removeItem("id");
        localStorage.removeItem("user");
        console.log(localStorage);
        verifica();
    })

    function verifica() {
        let login = localStorage.getItem("user");
        let id = localStorage.getItem("id");
        if (login === null || id === null) {
            $(".login-drop").show();
            $(".registro-drop").show();

            $("#logout").hide();
            $("#carrinho").hide();
            $(".botao-add").prop("disabled", true);
            $(".compras-realizadas-item").hide();
        } else {
            $(".login-drop").hide();
            $(".registro-drop").hide();

            $("#logout").show();
            $("#carrinho").show();
            $(".botao-add").prop("disabled", false);
            $(".compras-realizadas-item").show();
        }
    }

    verifica();
});