$(document).ready(function() {
    var CONFIG = {
        root: '/',
        algolia: {
            applicationID: 'UH8MJPGTOJ',
            apiKey: '17dd22c525db1292bc2f7092bd7b632a',
            indexName: 'indexName',
            hits: { "per_page": 10 },
            labels: { "input_placeholder": "Searching...", "hits_empty": "未发现与 「${query}」相关的内容", "hits_stats": "${hits} 条相关条目，使用了 ${time} 毫秒" }
        }
    };
    var algoliaSettings = CONFIG.algolia;
    var isAlgoliaSettingsValid = algoliaSettings.applicationID &&
        algoliaSettings.apiKey &&
        algoliaSettings.indexName;
    if (!isAlgoliaSettingsValid) {
        window.console.error('Algolia Settings are invalid.');
        return;
    }
    var search = instantsearch({
        appId: algoliaSettings.applicationID,
        apiKey: algoliaSettings.apiKey,
        indexName: algoliaSettings.indexName,
        searchFunction: function(helper) {
            var searchInput = $('#algolia-search-input').find('input');
            if (searchInput.val()) {
                helper.search();
            }
        }
    });
    // Registering Widgets
    [
        instantsearch.widgets.searchBox({
            container: '#algolia-search-input',
            placeholder: algoliaSettings.labels.input_placeholder
        }),
        instantsearch.widgets.hits({
            container: '#algolia-hits',
            hitsPerPage: algoliaSettings.hits.per_page || 10,
            templates: {
                item: function(data) {
                    return (
                        '<a href="' + CONFIG.root + data.slug + '" class="algolia-hit-item-link">' +
                        data._highlightResult.title.value +
                        '</a>'
                    );
                },
                empty: function(data) {
                    return (
                        '<div id="algolia-hits-empty">' +
                        algoliaSettings.labels.hits_empty.replace(/\$\{query}/, data.query) +
                        '</div>'
                    );
                }
            },
            cssClasses: {
                item: 'algolia-hit-item'
            }
        }),
        instantsearch.widgets.stats({
            container: '#algolia-stats',
            templates: {
                body: function(data) {
                    var stats = algoliaSettings.labels.hits_stats
                        .replace(/\$\{hits}/, data.nbHits)
                        .replace(/\$\{time}/, data.processingTimeMS);
                    return (
                        stats +
                        '<span class="algolia-powered">' +
                        '  <img src="' + CONFIG.root + 'images/algolia_logo.svg" alt="Algolia" />' +
                        '</span>' +
                        '<hr />'
                    );
                }
            }
        }),
        instantsearch.widgets.pagination({
            container: '#algolia-pagination',
            scrollTo: false,
            showFirstLast: false,
            labels: {
                first: '<i class="fa fa-angle-double-left"></i>',
                last: '<i class="fa fa-angle-double-right"></i>',
                previous: '<i class="fa fa-angle-left"></i>',
                next: '<i class="fa fa-angle-right"></i>'
            },
            cssClasses: {
                root: 'pagination',
                item: 'pagination-item',
                link: 'page-number',
                active: 'current',
                disabled: 'disabled-item'
            }
        })
    ].forEach(search.addWidget, search);
    search.start();
    $('.popup-trigger').on('click', function(e) {
        e.stopPropagation();
        $('body').append('<div class="popoverlay">').css('overflow', 'hidden');
        $('.popoverlay').fadeIn(300);
        $('.popup').fadeIn(300);
        $('#algolia-search-input').find('input').focus();
    });
    $('.popup-btn-close').click(function() {
        $('.popoverlay').fadeOut(300);
        $('.popup').fadeOut(300);
        $('.popoverlay').remove();
        $('body').css('overflow', '');
    });
});