//share code that each pages can reuse (this file uses jquery)
$("#postTextarea").keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim()

    const submitButton = $("#submitPostButton")
    
    if (submitButton.length == 0) return alert("no submit button found")

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }
    submitButton.prop("disabled", false)
})
