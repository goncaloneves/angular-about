'use strict';

describe('The home view', function () {

  beforeEach(function () {
    browser.get('http://localhost:3000/home');
  });

  var view;

  it('should have a working about page', function() {
    view = element(by.css('[ng-view]'));
    expect(browser.getLocationAbsUrl()).toBe('/');
    expect(view).toBeDefined();
  });

  it('should have a title and content', function() {
    var title = view.element(by.css('.title'));
    var content = view.element(by.css('.text'));

    expect(title).toBeDefined();
    expect(content).toBeDefined();
  });

});
