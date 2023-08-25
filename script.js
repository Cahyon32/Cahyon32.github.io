/* Data JSON yang Anda berikan */
    function formatRupiah(angka) {
      var reverse = angka.toString().split('').reverse().join(''),
          ribuan = reverse.match(/\d{1,3}/g);
      ribuan = ribuan.join('.').split('').reverse().join('');
      return "Rp " + ribuan;
    }

function isWithinDateRange(startDate, endDate) {
    var currentDate = new Date();
    return startDate <= currentDate && currentDate <= endDate;
}

/* Fungsi untuk merender produk ke dalam daftar produk */
function renderProduct(product, productList) {
    var productDiv = document.createElement("div");
    productDiv.className = "product";

    var productImage = document.createElement("img");
    productImage.className = "product-image";
    productImage.src = product.url_gambar_produk;
    productImage.alt = product.nama_produk;

    var productName = document.createElement("h2");
    productName.className = "product-name";
    productName.textContent = product.nama_produk;

    var productAsli = document.createElement("p");
    productAsli.className = "harga-asli";
    productAsli.textContent = formatRupiah(product.harga_produk_asli);
    if (product.harga_produk_asli == 0) {
        productAsli.style.visibility = "hidden";
    }

    var productPrice = document.createElement("h6");
    productPrice.className = "harga-promo";
    productPrice.textContent = formatRupiah(product.harga_produk);

    // Kode untuk menampilkan persentase diskon
    if (product.harga_produk_asli > 0) {
        var discountPercentage = ((product.harga_produk_asli - product.harga_produk) / product.harga_produk_asli) * 100;
        var discountTag = document.createElement("p");
        discountTag.className = "discount-tag";
        discountTag.textContent = `-${discountPercentage.toFixed(0)}%`;
        productDiv.appendChild(discountTag);
    }

    var productButton = document.createElement("button");
    productButton.className = "product-button";
    productButton.textContent = "Pesan Sekarang";
    productButton.addEventListener("click", function () {
        window.location.href = product.url_produk;
    });

    // Menyisipkan elemen-elemen ke dalam productDiv
    productDiv.appendChild(productImage);
    productDiv.appendChild(productName);
    productDiv.appendChild(productAsli);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(productButton);

    // Menyisipkan productDiv ke dalam productList
    productList.appendChild(productDiv);
}


/* Fungsi untuk mengambil data produk dan merendernya */
function fetchDataAndRenderProducts(apiUrl, page, productList) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl + "&page=" + page, true);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseData = JSON.parse(this.responseText);
            console.log(responseData);

            var startDate1 = new Date("2023-08-25");
            var endDate1 = new Date("2023-08-28");

            var startDate2 = new Date("2023-08-23");
            var endDate2 = new Date("2023-09-05");

            responseData.data.forEach(function (product) {
                if ((isWithinDateRange(startDate1, endDate1) && ["1312800"].includes(product.id_produk)) ||
                    (isWithinDateRange(startDate2, endDate2) && ["2110892","1354423","2110895","2110897","2110904","1787848","2110893","1702535","1695221","1322585","1312780","1692420","1305702","1312775","1769281","1769277","1351985","1353325","1333493","1352112","1688553"].includes(product.id_produk))) {
                    renderProduct(product, productList);
                }
            });
        }
    };

    xhr.send();
}
var token = "eyJhcHAiOiIzNTM4NiIsImF1dGgiOiIyMDIwMDkxMiIsInNpZ24iOiJEOW9WSXAzU3owMVZlR1pscElTTEJnPT0ifQ==";

var apiList = [];
for (var page = 1; page <= 50; page++) {
    var url = `https://openapi.bukaolshop.net/v1/app/produk?token=${token}&page=${page}`;
    apiList.push({ url: url, page: page });
}

apiList.forEach(function(api) {
    var productList = document.getElementById("product-list");
    fetchDataAndRenderProducts(api.url, api.page, productList);
});