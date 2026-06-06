// Endpoint για έργα τέχνης
var ARTWORKS_URL = "https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&cc0=1&limit=20";

// Τα τμήματα του μουσείου
var DEPARTMENTS = [
  "African Art",
  "American Painting and Sculpture",
  "Art of the Americas",
  "Chinese Art",
  "Contemporary Art",
  "Decorative Art and Design",
  "Drawings",
  "Egyptian and Ancient Near Eastern Art",
  "European Painting and Sculpture",
  "Greek and Roman Art",
  "Indian and South East Asian Art",
  "Islamic Art",
  "Japanese Art",
  "Korean Art",
  "Medieval Art",
  "Modern European Painting and Sculpture",
  "Oceania",
  "Performing Arts, Music, & Film",
  "Photography",
  "Prints",
  "Textiles"
];

// Εμφάνιση Τμημάτων
function loadDepartments() {
  var tbody = document.getElementById("dept-body");
  tbody.innerHTML = ""; 

  for (var i = 0; i < DEPARTMENTS.length; i++) {
    var row = document.createElement("tr");
    row.innerHTML = "<td>" + (i + 1) + "</td><td>" + DEPARTMENTS[i] + "</td>";
    tbody.appendChild(row);
  }
}

// Φόρτωση Έργων Τέχνης
function loadArtworks() {
  fetch(ARTWORKS_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var grid = document.getElementById("artworks-grid");
      grid.innerHTML = ""; 

      var allArtworks = data.data;
      var artworksWithImages = [];

      for (var i = 0; i < allArtworks.length; i++) {
        var a = allArtworks[i];
        if (a.images && a.images.web && a.images.web.url && a.images.web.url !== "") {
          artworksWithImages.push(a);
        }
        if (artworksWithImages.length === 10) break;
      }

      for (var j = 0; j < artworksWithImages.length; j++) {
        var artwork = artworksWithImages[j];
        var title = artwork.title || "Χωρίς τίτλο";

        var creator = "Άγνωστος δημιουργός";
        if (artwork.creators && artwork.creators.length > 0) {
          creator = artwork.creators[0].description;
        }

        var imageUrl = artwork.images.web.url;

        var card = document.createElement("div");
        card.className = "artwork-card";

        card.innerHTML =
          "<div class='artwork-info'>" +
            "<div class='artwork-title'>" + title + "</div>" +
            "<div class='artwork-creator'>" + creator + "</div>" +
            "<button class='btn-show-image'>Εμφάνισε Εικόνα</button>" +
          "</div>" +
          "<img class='artwork-image' src='" + imageUrl + "' alt='" + title + "' />";

        var btn = card.querySelector(".btn-show-image");
        var img = card.querySelector(".artwork-image");

        (function(b, im) {
          b.addEventListener("click", function() {
            if (im.style.display === "block") {
              im.style.display = "none";
              b.textContent = "Εμφάνισε Εικόνα";
            } else {
              im.style.display = "block";
              b.textContent = "✕ Κλείσε Εικόνα";
            }
          });
        })(btn, img);

        grid.appendChild(card);
      }

      if (artworksWithImages.length === 0) {
        grid.innerHTML = "<p>Δεν βρέθηκαν έργα με διαθέσιμη εικόνα αυτή τη στιγμή.</p>";
      }
    })
    .catch(function(error) {
      document.getElementById("artworks-grid").innerHTML =
        "<p>Σφάλμα φόρτωσης έργων τέχνης. Ελέγξτε τη σύνδεσή σας.</p>";
      console.error("Σφάλμα artworks:", error);
    });
}

// Εκκίνηση
loadDepartments();
loadArtworks();