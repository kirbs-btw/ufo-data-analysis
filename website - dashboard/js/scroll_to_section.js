function scrollToSection() {
    // Get the section you want to scroll to
    var section = document.getElementById("map-box-div-sub-dashboard");
    
    // Calculate the top offset of the section
    var sectionOffset = section.offsetTop;
    
    // Scroll to the section with smooth behavior
    window.scrollTo({
      top: sectionOffset,
      behavior: 'smooth'
    });
  }
  