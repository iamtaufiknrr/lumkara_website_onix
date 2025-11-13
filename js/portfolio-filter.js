// Portfolio See More functionality - Load 6 items at a time (2 rows x 3 cols)
(function($) {
    'use strict';

    $(document).ready(function() {
        var currentFilter = '*';
        var itemsToShow = 6; // Show 6 items initially (2 rows x 3 cols)
        var itemsPerLoad = 6; // Load 6 more items each time (2 rows)
        
        // Initially show only first 4 items
        var $allItems = $('#portfolioGrid .grid-item');
        $allItems.each(function(index) {
            if (index >= itemsToShow) {
                $(this).hide();
            }
        });
        
        // Show See More button initially
        $('#seeMoreBtn').show();
        updateSeeMoreButton();

        // Portfolio filter buttons click handler
        $('.portfolio-menu button').on('click', function() {
            currentFilter = $(this).attr('data-filter');
            
            if (currentFilter === '*') {
                // SEMUA: Reset to show only first 4 items
                $allItems.each(function(index) {
                    if (index >= itemsToShow) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
                updateSeeMoreButton();
            } else {
                // Specific category: Show only first 3 items in that category
                $allItems.hide();
                $('#portfolioGrid .grid-item' + currentFilter).each(function(index) {
                    if (index < 3) {
                        $(this).show();
                    }
                });
                $('#seeMoreBtn').hide();
            }
            
            // Trigger Isotope layout
            setTimeout(function() {
                if (typeof $.fn.isotope !== 'undefined' && $('#portfolioGrid').data('isotope')) {
                    $('#portfolioGrid').isotope('layout');
                }
            }, 100);
        });

        // See More button functionality - Load 4 more items
        $('#seeMoreBtn').on('click', function() {
            var $hiddenItems = $('#portfolioGrid .grid-item:hidden');
            var itemsShown = 0;
            
            $hiddenItems.each(function() {
                if (itemsShown < itemsPerLoad) {
                    $(this).fadeIn(300);
                    itemsShown++;
                }
            });
            
            // Update items to show count
            itemsToShow += itemsPerLoad;
            
            // Trigger Isotope layout
            setTimeout(function() {
                if (typeof $.fn.isotope !== 'undefined' && $('#portfolioGrid').data('isotope')) {
                    $('#portfolioGrid').isotope('layout');
                }
            }, 350);
            
            // Check if there are more items to show
            updateSeeMoreButton();
        });
        
        function updateSeeMoreButton() {
            var $hiddenItems = $('#portfolioGrid .grid-item:hidden');
            if ($hiddenItems.length === 0) {
                $('#seeMoreBtn').fadeOut(300);
            } else {
                $('#seeMoreBtn').show();
            }
        }
    });

})(jQuery);
