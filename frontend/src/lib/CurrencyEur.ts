export default class CurrencyEur {

    private static readonly formatter = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    });

    static format(amount: number): string {
        return CurrencyEur.formatter.format(amount);
    }

    static formatOrNull(amount: number | undefined): string {
        if( !amount ) {
            return "-,-- €";
        }
        return CurrencyEur.formatter.format(amount);
    }

}