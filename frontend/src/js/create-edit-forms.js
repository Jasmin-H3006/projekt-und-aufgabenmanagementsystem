export async function responseFunctionPutPost(editElement, responseUrlEdit, responseUrlNotEdit, payload) {
    const responseUrl = editElement ? responseUrlEdit : responseUrlNotEdit;
    const method = editElement ? "PUT" : "POST";

    // Save process
    return await fetch(responseUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}