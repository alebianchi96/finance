import moment from 'moment-timezone'
import RangeDateDto from "@/dto/utils/RangeDateDto.ts";

export default class DateUtils {

    // private static TIMEZONE_ROME : string = 'Europe/Rome';

    private static getLocaleTz() : string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    static formatDateByTemplate(d:Date, template:string):string|undefined {
        if(!d) { return undefined; }
        return moment( d )
            .tz(DateUtils.getLocaleTz())
            // .format("YYYY-MM-DD HH:mm:ss.SSS");
            .format(template);
    }

    static formatDate(d:Date):string|undefined {
        return DateUtils.formatDateByTemplate(d, "YYYY-MM-DD");
    }

    static getMonthIndex(d:Date): number {
        if(!d) { return ""; }
        const currentMonthAsString = moment( d )
            .tz(DateUtils.getLocaleTz())
            .format("MM");
        return Number.parseInt(currentMonthAsString)-1;
    }

    static getMonthName(d:Date): string {
        if(!d) { return ""; }
        const currentMonthAsString = moment( d )
            .tz(DateUtils.getLocaleTz())
            .format("MM");
        return DateUtils.getMonthNameByIndex112( currentMonthAsString );
    }


    static getMonthNameByIndex112( index112:string ) : string {
        if(!index112) { return ""; }
        const monthIndex = Number.parseInt( index112 ) - 1;
        const monthNames = [
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
            "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
        ];
        return monthNames[monthIndex];
    }


    static parse(yyyyMMdd: string|undefined): Date|undefined {

        if(!yyyyMMdd) { return undefined; }

        if(yyyyMMdd.indexOf("-") === -1) {
            return undefined;
        }

        return moment(yyyyMMdd, "YYYY-MM-DD").tz(DateUtils.getLocaleTz()).toDate()
    }

    /* Date ranges */
    static currentMonthRange() : RangeDateDto {
        const now   = DateUtils.currentDate();
        const from  = new Date(now.getFullYear(), now.getMonth(), 1);
        const to    = new Date(now.getFullYear(), now.getMonth()+1, 0);
        return new RangeDateDto(from, to);
    }

    static currentYearRange() : RangeDateDto {
        const now   = DateUtils.currentDate();
        const from  = new Date(now.getFullYear(), 0, 1);
        const to    = new Date(now.getFullYear()+1, 0, 0);
        return new RangeDateDto(from, to);
    }

    static currentDate() : Date {
        return moment().tz(DateUtils.getLocaleTz()).toDate();
    }

    static startOfMonthDate() : Date {
        let startMonth = DateUtils.currentDate();
        startMonth.setDate(1);
        return startMonth;
    }

    static startOfYearDate(year:number | undefined) : Date {
        year = year ?? DateUtils.currentDate().getFullYear();
        return moment(new Date(year, 0, 0))
            .tz(DateUtils.getLocaleTz())
            .toDate();
    }


    static currentYearAsString() : string {
        return DateUtils.getUnitAsStringFromCurrentDate( "YYYY" );
    }

    static getUnitAsStringFromCurrentDate( timeUnit:string ) : string {
        return DateUtils.getUnitAsStringFromDate( moment().toDate(), timeUnit )
    }

    static getUnitAsStringFromDate( dt:Date, timeUnit:string ) : string {
        return moment(dt)
            .tz(DateUtils.getLocaleTz())
            .format(timeUnit);
    }

    static createBlockId() :number {
        return DateUtils.currentDate().getTime();
    }


    static /* className={ DateUtils.isFuture( transfer.dt ) } */ isFuture( d:Date ):string {

        if(!d) { return ""; }

        // current date
        let currYear : number = Number.parseInt( DateUtils.getUnitAsStringFromCurrentDate( "YYYY" ) );
        let currMonth : number = Number.parseInt( DateUtils.getUnitAsStringFromCurrentDate( "MM" ) );
        let currDay : number = Number.parseInt( DateUtils.getUnitAsStringFromCurrentDate( "DD" ) );

        let givenYear : number = Number.parseInt( DateUtils.getUnitAsStringFromDate( d, "YYYY" ) );
        let givenMonth : number = Number.parseInt( DateUtils.getUnitAsStringFromDate( d, "MM" ) );
        let givenDay : number = Number.parseInt( DateUtils.getUnitAsStringFromDate( d, "DD" ) );

        let isFuture : boolean = givenYear > currYear
            || ( givenYear === currYear && givenMonth > currMonth )
            || ( givenYear === currYear && givenMonth === currMonth && givenDay > currDay );

        if( isFuture ) {
            return "text-red-500 font-bold";
        }
        return "";
    }

}