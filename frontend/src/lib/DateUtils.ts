export default class DateUtils {

    static formatDate(d:Date):string|undefined {
        if(!d) { return undefined; }

        let y :string = "";
        let m :string = "";
        let day :string = "";

        if(typeof d === 'string') {
            let dtArr = d.split("T")[0];
            y = dtArr.split("-")[0];
            m = dtArr.split("-")[1];
            day = dtArr.split("-")[2];
        } else {
            y = d.getFullYear();
            m = (d.getMonth()+1).toString().padStart(2, "0");
            day = d.getUTCDate().toString().padStart(2, "0");
        }

        let formattedDate = `${y}-${m}-${day}`
        // console.log(formattedDate);
        return formattedDate;
    }

    static getMonthName(d:Date): string {
        if(!d) { return ""; }

        const monthNames = [
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
            "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
        ];

        return monthNames[d.getMonth()];
    }

    static parse(yyyyMMdd: string|undefined): Date|undefined {
        if(!yyyyMMdd) { return undefined; }
        if(yyyyMMdd.indexOf("-") === -1) {
            return undefined;
        }
        let arr = yyyyMMdd.split("-");
        return new Date(
            parseInt(arr[0]),
            parseInt(arr[1]) - 1, // Mese in JavaScript è zero-based
            parseInt(arr[2]) // Giorno
        );
    }

}