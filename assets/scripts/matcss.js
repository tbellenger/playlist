var dropdowns = document.querySelectorAll('.dropdown-trigger')
for (var i = 0; i < dropdowns.length; i++){
    M.Dropdown.init(dropdowns[i]);
}
