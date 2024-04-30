function checkboxHandler(selectedCheckbox) {
    // Get all checkboxes with the same name or class
    const checkboxes = document.querySelectorAll('.sort-checkbox');

    // Loop through all checkboxes
    checkboxes.forEach(function(checkbox) {
        // Uncheck all other checkboxes except the one that was just clicked
        if (checkbox !== selectedCheckbox) {
            checkbox.checked = false;
        }
    });
}