export default class CurrencyEur {

    static instance: CurrencyEur | null = null;

    static getInstance(): CurrencyEur {
        if (!this.instance) {
            this.instance = new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR'
            });
        }
        return this.instance;
    }

    format(amount: number): string {
        return CurrencyEur.getInstance().format(amount);
    }

}