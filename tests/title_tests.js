"use strict";

(function() {
  var TITLE_HTML = (
    '<h1>' +
      '<a href="#">' +
        '<span id="document-title">Title of this document</span>' +
        '<span id="title-edit">' +
          '<i class="fa fa-save"></i>' +
          '<i class="fa fa-rotate-left"></i>' +
        '</span>' +
      '</a>' +
    '</h2>'
  );

  describe("Title", function() {
    var element, title;
    var save_button, revert_button, edit_button, title_span, edit_controls;

    var save_function = jasmine.createSpy("save_function");

    beforeEach(function() {
      // HTML setup
      element = $(TITLE_HTML);
      edit_controls = $("#title-edit", element);
      save_button = $(".fa-save", element);
      revert_button = $(".fa-rotate-left", element);
      edit_button = title_span = $("#document-title", element);
      edit_controls.hide();
      $('body').append(element);

      title = new Title(save_function);
    });

    it("should be able to edit, save, and revert", function() {
      expect(edit_controls).toBeHidden();

      // Edit
      edit_button.click();
      expect(edit_controls).toBeVisible();
      expect(title_span.attr("contenteditable")).toBe("true");

      // Save
      title_span.text("test1");
      save_button.click();
      expect(save_function).toHaveBeenCalledWith("test1");
      expect(edit_controls).toBeHidden();
      expect(title_span.text()).toBe("test1");

      // Revert
      save_function.calls.reset();
      edit_button.click();
      title_span.text("test2");
      revert_button.click();
      expect(save_function).not.toHaveBeenCalled();
      expect(edit_controls).toBeHidden();
      expect(title_span.text()).toBe("test1");
    });

    afterEach(function() {
      element.remove();
    });
  });
})();
