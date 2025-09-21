import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import Constants from "@/constants/Constants.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isInitItem( code : string ) {
    return code.startsWith(Constants.INIT_ITEMS_CODE_PREFIX);
}

export function filterInitItems( list : { code: string }[] ) : any[] {
    return list.filter( item => !isInitItem(item.code) );
}