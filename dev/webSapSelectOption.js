/*globals $, jQuery*/

(function ($) {
    'use strict';
    $.fn.webSapSelectOption = function (config) {

        return this.each(function () {
            config.container = $(this);
            var selectOption = new webSapSelectOption(config);
            selectOption.init();
        });
    }
}(jQuery));

var webSapSelectOption = function (config) {
    var self = this;
    self.settings = $.extend({
        container : null,
        labelText: "not set",
        rangeSearchHelp: true,
        callback: function () {
            return null;
        },
        allowTypeHelp: false,
        typeHelpMinLength: 3,
        typeHelpFunction: function (request, response) {
            response($.map([], function () {
                return {
                    label: null,
                    value: null
                };
            }));
        }
    }, config);
    self.components = {
        wrapper: null,
        label: null,
        button: null,
        dialogForm: null,
        result: null,
        dropSign: null,
        dropOption: null,
        textMax:null,
        textMin:null
    };
    self.data = [];
};

webSapSelectOption.prototype  = function () {
    var init,
        createMarkup,
        getElementsFromMarkup,
        setInitialStateForElements,
        setHandlersForElements,
        refreshModalValues,
        validateValues,
        getDataFromModal;
    createMarkup = function (self) {
        self.components.wrapper = $(
            '<div id="webSapSelectOption">' +
            '<button class="webSapSelectOption_buttoPopUp"></button>' +
            '<h4 class="webSapSelectOption_title" style="display: inline-block;"></h4>' +
            '<div class="webSapSelectOption_resultContainer"></div>' +
            '<div class="webSapSelectOption_dialog">' +
            '<h4>Selection criteria</h4>' +
            '<table>' +
            '<tr>' +
            '<td>' +
            'Mode:' +
            '</td>' +
            '<td>' +
            '<select name="mode" class="webSapSelectOption_sign">' +
            '<option value="I">Include</option>' +
            '<option value="E">Exclude</option>' +
            '</select>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            'Filter:' +
            '</td>' +
            '<td>' +
            '<select name="mode" class="webSapSelectOption_option">' +
            '<option value="BT">Between</option>' +
            '<option value="EQ">Equal</option>' +
            '</select>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            'Value from:' +
            '</td>' +
            '<td>' +
            '<input type="text" class="webSapSelectOption_valueFrom">' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            'Value To:' +
            '</td>' +
            '<td>' +
            '<input type="text" class="webSapSelectOption_valueTo">' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</div>');
        self.settings.container.append(self.components.wrapper);
    };
    getElementsFromMarkup = function (self) {
        self.components.button = self.components.wrapper.find(".webSapSelectOption_buttoPopUp");
        self.components.label = self.components.wrapper.find(".webSapSelectOption_title");
        self.components.dialogForm = self.components.wrapper.find(".webSapSelectOption_dialog");
        self.components.result = self.components.wrapper.find(".webSapSelectOption_resultContainer");
        self.components.dropOption = self.components.wrapper.find(".webSapSelectOption_option");
        self.components.dropSign = self.components.wrapper.find(".webSapSelectOption_sign");
        self.components.textMin = self.components.wrapper.find(".webSapSelectOption_valueFrom");
        self.components.textMax = self.components.wrapper.find(".webSapSelectOption_valueTo");

    };
    setInitialStateForElements = function (self) {
        self.components.label.html(self.settings.labelText);
        self.components.button.button({
            icons: {
                primary: "ui-icon-search"
            },
            text: false
        });
        self.components.dialogForm.dialog({
            autoOpen: false,
            height: 400,
            width: 400,
            modal: true,
            buttons: {
                "Select": function () {
                    self.components.dialogForm.trigger("newItemAdded");
                } ,
                "Cancel" : function() {
                    self.components.dialogForm.dialog( "close" );
                }
            },
            close: function() {

            }
        });
    };
    setHandlersForElements = function (self) {
        self.components.button.click(function () {
            self.components.dialogForm.dialog('open');
        });
        self.components.dropOption.change(function () {
            if($(this).val() === "BT"){
                self.components.textMax.prop('disabled', false);
            } else {
                self.components.textMax.prop('disabled', true);
                self.components.textMax.val('');
            }
        });
        self.components.dialogForm.on('newItemAdded', function () {
            var data = getDataFromModal(self);
            if(validateValues(data).length === 0){
                self.components.dialogForm.dialog('close');
                self.data.push(data);
                self.components.result.trigger('refreshOutput');
                refreshModalValues(self);
                self.settings.callback(self.data);
            } else {
                //todo
            }
        })
        self.components.result.on('refreshOutput', function () {
            var $this = $(this),
                tmpItem,
                tmpButton,
                tmpPar;
            $this.empty();
            self.data.forEach(function (item) {
                tmpItem = $("<div></div>");
                tmpButton = $('<button class=""></button>');
                tmpPar = $('<span>' + item.sign + ' ' + item.option + ' ' + item.low + ' ' + item.high + '</span>');

                tmpButton.click(function () {
                    self.data.splice(self.data.indexOf(item), 1);
                    self.components.result.trigger('refreshOutput');
                    self.settings.callback(self.data);
                });
                tmpButton.button({
                    icons: {
                        primary: "ui-icon-circle-close"
                    },
                    text: false
                });

                tmpButton.appendTo(tmpItem);
                tmpPar.appendTo(tmpItem);
                tmpItem.appendTo($this);
            })

        });

        if(self.settings.allowTypeHelp === true) {
            self.components.textMax.autocomplete({
                minLength: self.settings.typeHelpMinLength,
                source: self.settings.typeHelpFunction
            });
            self.components.textMin.autocomplete({
                minLength: self.settings.typeHelpMinLength,
                source: self.settings.typeHelpFunction
            });
        }
    };
    refreshModalValues= function (self) {
       self.components.dropOption.val('BT');
       self.components.dropSign.val('I');
       self.components.textMin.val('');
       self.components.textMax.val('');
       self.components.textMax.prop('disabled', false);

    };
    validateValues = function (data) {
        //todo
        return [];
    };
    getDataFromModal = function (self) {
        return {
            sign : self.components.dropSign.val(),
            option: self.components.dropOption.val(),
            low: self.components.textMin.val(),
            high: self.components.textMax.val()
        }
    };
    init = function () {
        var self = this;
        createMarkup(self);
        getElementsFromMarkup(self);
        setInitialStateForElements(self);
        setHandlersForElements(self);
        refreshModalValues(self);
    };
    return{
        init: init
    }
}();