export default class RangeDateDto {

    from : Date|undefined;
    to : Date|undefined;

    constructor( from:Date|undefined, to:Date|undefined ) {
        this.from = from;
        this.to = to;
    }

}