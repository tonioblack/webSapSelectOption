/*globals $, jQuery*/

var WebSapSelectOption = function (config) {
    'use strict';
    var self = this;
    self.settings = $.extend({
        container : null,
        modalWitdh: 300,
        modalHeigth: 300,
        modalTableClass: '',
        resultTableClass: '',
        buttonClasses: 'btn btn-primary',
        buttonDeleteClasses: 'btn btn-danger',
        iconClasses: 'glyphicon glyphicon-search',
        iconDeleteClasses: 'glyphicon glyphicon-remove',
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
        textMax: null,
        textMin: null,
        validationError : null
    };
    self.data = [];
};

WebSapSelectOption.prototype  = (function () {
    'use strict';
    var init,
        createMarkup,
        getElementsFromMarkup,
        setInitialStateForElements,
        setHandlersForElements,
        refreshModalValues,
        validateValues,
        getDataFromModal,
        writeErrors;
    createMarkup = function (self) {
        self.components.wrapper = $(
            '<div id="WebSapSelectOption">' +
                '<button class="WebSapSelectOption_buttoPopUp ' + self.settings.buttonClasses + '"><i class="' + self.settings.iconClasses + '"></i></button>' +
                '<h4 class="WebSapSelectOption_title" style="display: inline-block;"></h4>' +
                '<div class="WebSapSelectOption_resultContainer"></div>' +
                '<div class="WebSapSelectOption_dialog" title="' + self.settings.labelText + '">' +
                '<h4>Selection criteria</h4>' +
                '<table class="' + self.settings.modalTableClass + '">' +
                '<tr>' +
                '<td>' +
                'Mode:' +
                '</td>' +
                '<td>' +
                '<select name="mode" class="WebSapSelectOption_sign">' +
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
                '<select name="mode" class="WebSapSelectOption_option">' +
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
                '<input type="text" class="WebSapSelectOption_valueFrom">' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                'Value To:' +
                '</td>' +
                '<td>' +
                '<input type="text" class="WebSapSelectOption_valueTo">' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2">' +
                '<div class="WebSapSelectOption_validationError"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>'
        );
        self.settings.container.append(self.components.wrapper);
    };
    getElementsFromMarkup = function (self) {
        self.components.button = self.components.wrapper.find(".WebSapSelectOption_buttoPopUp");
        self.components.label = self.components.wrapper.find(".WebSapSelectOption_title");
        self.components.dialogForm = self.components.wrapper.find(".WebSapSelectOption_dialog");
        self.components.result = self.components.wrapper.find(".WebSapSelectOption_resultContainer");
        self.components.dropOption = self.components.wrapper.find(".WebSapSelectOption_option");
        self.components.dropSign = self.components.wrapper.find(".WebSapSelectOption_sign");
        self.components.textMin = self.components.wrapper.find(".WebSapSelectOption_valueFrom");
        self.components.textMax = self.components.wrapper.find(".WebSapSelectOption_valueTo");
        self.components.validationError = self.components.wrapper.find(".WebSapSelectOption_validationError");

    };
    setInitialStateForElements = function (self) {
        self.components.label.html(self.settings.labelText);
        self.components.dialogForm.dialog({
            autoOpen: false,
            height: self.settings.modalHeigth,
            width: self.settings.modalWitdh,
            modal: true,
            buttons: {
                "Select": function () {
                    self.components.dialogForm.trigger("newItemAdded");
                },
                "Cancel" : function () {
                    self.components.dialogForm.dialog("close");
                }
            },
            close: function () {
                refreshModalValues(self);
            }
        });
    };
    setHandlersForElements = function (self) {
        self.components.button.click(function () {
            self.components.dialogForm.dialog('open');
        });
        self.components.dropOption.change(function () {
            if ($(this).val() === "BT") {
                self.components.textMax.prop('disabled', false);
            } else {
                self.components.textMax.prop('disabled', true);
                self.components.textMax.val('');
            }
        });
        self.components.dialogForm.on('newItemAdded', function () {
            var data = getDataFromModal(self),
                issues = validateValues(data);
            if (issues.length === 0) {
                self.components.dialogForm.dialog('close');
                self.data.push(data);
                self.components.result.trigger('refreshOutput');
                refreshModalValues(self);
                self.settings.callback(self.data);
            } else {
                writeErrors(self, issues);
            }
        });
        self.components.result.on('refreshOutput', function () {
            var $this = $(this),
                tmpItem,
                tmpHead,
                tmpBody,
                tmpTr;
            $this.empty();
            if (self.data.length > 0) {
                tmpItem = $('<table class="' + self.settings.resultTableClass + '"></table>');
                tmpHead = $('<thead><tr><td></td><td>Sign</td><td>Option</td><td>Low</td><td>High</td></tr></thead>');
                tmpBody = $('<tbody></tbody>');
                tmpHead.appendTo(tmpItem);
                tmpBody.appendTo(tmpItem);
                tmpItem.appendTo($this);
                self.data.forEach(function (item) {
                    tmpTr = $('<tr>' +
                        '<td>' +
                        '<button class="' + self.settings.buttonDeleteClasses + '"><i class="' + self.settings.iconDeleteClasses + '"></i></button>' +
                        '</td>' +
                        '<td>' +
                        (item.sign === 'I' ? 'Include' : 'Esclude') +
                        '</td>' +
                        '<td>' +
                        (item.option === 'BT' ? 'Beetween' : 'Equal') +
                        '</td>' +
                        '<td>' +
                        item.low +
                        '</td>' +
                        '<td>' +
                        item.high +
                        '</td>' +
                        '</tr>');
                    tmpTr.find('button').click(function () {
                        self.data.splice(self.data.indexOf(item), 1);
                        self.components.result.trigger('refreshOutput');
                        self.settings.callback(self.data);
                    });
                    tmpTr.appendTo(tmpBody);
                });
            }
        });

        if (self.settings.allowTypeHelp === true) {
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
    refreshModalValues = function (self) {
        self.components.dropOption.val('BT');
        self.components.dropSign.val('I');
        self.components.textMin.val('');
        self.components.textMax.val('');
        self.components.textMax.prop('disabled', false);
        self.components.validationError.empty();
    };
    validateValues = function (data) {
        var issues = [];
        if (!data.low) {
            issues.push("Insert a value into the field 'Value from'");
        }
        if (data.option === 'BT' && !data.high) {
            issues.push("Insert a value into the field 'Value to'");
        }
        return issues;
    };
    writeErrors = function (self, issues) {
        self.components.validationError.empty();
        issues.forEach(function (item) {
            self.components.validationError.append('<p style="color: #f00">' + item + '</p>');
        });
    };
    getDataFromModal = function (self) {
        return {
            sign : self.components.dropSign.val(),
            option: self.components.dropOption.val(),
            low: self.components.textMin.val(),
            high: self.components.textMax.val()
        };
    };
    init = function () {
        var self = this;
        createMarkup(self);
        getElementsFromMarkup(self);
        setInitialStateForElements(self);
        setHandlersForElements(self);
        refreshModalValues(self);
    };
    return {
        init: init
    };
}());

(function ($) {
    'use strict';
    $.fn.WebSapSelectOption = function (config) {
        return this.each(function () {
            config.container = $(this);
            var selectOption = new WebSapSelectOption(config);
            selectOption.init();
        });
    };
}(jQuery));