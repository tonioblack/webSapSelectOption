/**
 * Created by antonio on 13/11/2014.
 */
/*globals $, jQuery*/

(function ($) {
    'use strict';
    $.fn.webSapSelectOption = function (config) {
        var settings = $.extend({
                labelText: "not set",
                rangeSearchHelp: true,
                typeHelpMinLength: 3,
                typeHelpFunction: function (request, response) {
                    response($.map([], function () {
                        return {
                            label: null,
                            value: null
                        };
                    }));
                }
            }),
            privates = {
                createElements: function (container) {
                    var wrapper, label, textBox1, span;
                    wrapper = $('<div></div>');
                    label = $('<label>' + settings.labelText  + '</label>');
                    textBox1 = $('<input type="text"/>');
                    span = $('<span class="ui-icon ui-icon-arrowthick-1-n"></span>');
                    wrapper.appendTo(container);
                    label.appendTo(container);
                    textBox1.appendTo(container);
                    span.appendTo(container);
                }
            };

        return this.each(function () {
            var self = this;
            self.init = function () {
                privates.createElements(self);
            };
            self.init();
        });
    };

}(jQuery));

/*
var webSapSelectOption = function (config) {







   */
/* var tbMaterial = selscren.find('#tbMaterial');


    tbMaterial.autocomplete({
            minLength: 3,
            source: function (request, response) {
                var url = appConfig.baseUrl + 'service.htm?Action=MaterialSearchHelp&MatString=' + request.term + '&PlantString=' + tbPlant.val();

                ajaxcall({url: url, method: 'GET', data: {}}, function (e, data) {
                    response($.map(data, function (item) {
                            return {
                                label: item.matnr + " - " + item.maktg,
                                value: item.matnr
                            }
                        })
                    )
                });
            }
        }
    );*//*



}*/
