var mockData = '[{"aufnr": "0000040000", "ktext": "Network NC"}, {"aufnr": "0000040000", "ktext": "Network 2"}, {"aufnr": "0000040000", "ktext": "Network 3"}, {"aufnr": "0000040000", "ktext": "Network 4"}, {"aufnr": "0000040000", "ktext": "Network 5"}, {"aufnr": "0000040000", "ktext": "Network 6"}, {"aufnr": "0000040000", "ktext": "Network 7"}, {"aufnr": "0000040000", "ktext": "Network 8"}]';

$.mockjax({
    url: "SearchHelp.json",
    responseText: JSON.parse(mockData)
});