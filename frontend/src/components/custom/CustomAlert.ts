export default class CustomAlert {

    // Esempio di modale personalizzata con titolo
    public static show(title, message) {

        const bgColor = 'rgba(0, 0, 0, 0.8)';

        const btnClose = `<button onclick="this.closest('div[style]').remove()">OK</button>`

        const modal = document.createElement('div');
        modal.innerHTML = `
            <div id="custom-alert" style="padding:10px;border-radius:8px;position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);width:75%;background:${bgColor};z-index:9999;">
              <div style="background:#fff;padding:1.5rem;border-radius:8px;width:100%;">
                <h2 style="margin-top:0">${title}</h2>
                <p>${message}</p>
              </div>
            </div>
          `;

        // ricerca nel document.body gli elementi aventi id="custom-alert"
        const existingAlert = document.getElementById('custom-alert');
        if(!existingAlert) {
            document.body.appendChild(modal);
        }
    }


}