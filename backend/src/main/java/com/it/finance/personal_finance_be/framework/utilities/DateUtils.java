package com.it.finance.personal_finance_be.framework.utilities;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class DateUtils {

    private DateUtils() {}

    final static ZoneId ZONE_ROME = ZoneId.of("Europe/Rome");

    public static final String COMPLETE = "yyyyMMdd HH:mm:ss";

    public static final String COMPLETE_TRADING_VIEW = "yyyy-MM-dd HH:mm:ss";

    public static final String COMPLETE_COMPRESSED = "yyyyMMddHH:mm:ss";

    public static final String COMPLETE_TAG = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    public static final String STANDARD = "dd/MM/yyyy";

    public static final String ISO = "dd-MM-yyyy";

    public static final String ISO_REV = "yyyy-MM-dd";

    public static final String COINMARKETCAP = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    public static final String COINGECKO = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";


    private static final String[] DAYS_OF_WEEK = new String[] {
            "domenica", "lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato"
    };

    private static final String[] MONTHS_OF_YEAR = new String[] {
            "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
            "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"
    };


    /**
     * Formatta la data secondo il template richiesto
     * */
    public static String formatDate(String format, Date data) {
        return new SimpleDateFormat(format).format(data);
    }


    /**
     * Trasforma in data un testo secondo il template richiesto
     * @throws ParseException
     * */
    public static Date parseDate(String format, String data) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        simpleDateFormat.setLenient(false);
        return simpleDateFormat.parse(data);
    }


    /**
     * Restituisce il nome del giorno della settimana corrispondente alla data
     * inserita
     *
     * Testo in minuscolo e italiano
     *
     * */
    public static String getDayOfWeek(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        int day = c.get(Calendar.DAY_OF_WEEK);
        return DAYS_OF_WEEK[day - 1];
    }


    /**
     * Restituisce il nome del mese dell'anno corrispondente alla data
     * inserita
     *
     * Testo in minuscolo e italiano
     *
     * */
    public static String getMonthOfYear(Date date) {
        Integer monthNumber = Integer.valueOf(formatDate("MM", date));
        return MONTHS_OF_YEAR[monthNumber-1];
    }


    /**
     * Estrae la data del primo giorno del mese della data in ingresso
     * Se si passa un secondo parametro: aumenta (>0) o diminuisce (<0) il mese
     * @param date
     * @param numMonthsToAdd
     * @throws ParseException
     */
    public static Date firstDateOfMonthByDate(Date date, Integer numMonthsToAdd) throws ParseException {
        String meseAnno = formatDate("MM-yyyy", date);
        date = parseDate(ISO, "01-" + meseAnno);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        if(numMonthsToAdd != null) {
            calendar.add(Calendar.MONTH, numMonthsToAdd);
        }
        return calendar.getTime();
    }


    /**
     * Estrae la data del primo giorno del mese della data in ingresso
     * @param date
     * @throws ParseException
     */
    public static Date firstDateOfMonthByDate(Date date) throws ParseException {
        return firstDateOfMonthByDate(date, null);
    }


    /**
     * Estrae la data del primo giorno dell'anno della data in ingresso
     * @param date
     * @throws ParseException
     */
    public static Date firstDateOfYearByDate(Date date) throws ParseException {
        String year = formatDate("yyyy", date);
        return parseDate("ddMMyyyy", "0101" + year);
    }


    /**
     * Restituisce la data in ingresso con orario riportato a mezzanotte
     * @throws ParseException
     * */
    public static Date getDateAtMidnight(Date date) throws ParseException {
        String formatted = formatDate(ISO_REV, date);
        return parseDate(ISO_REV, formatted);
    }


    /**
     * @param date
     * @param unitOntoOperate - attributo della classe Calendar: es.Calendar.DAY_OF_MONTH
     * @param value - se positivo aggiunge, altrimenti sottrae
     * @return
     */
    public static Date addUnit(Date date, int unitOntoOperate , int value) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(unitOntoOperate, value);
        return cal.getTime();
    }


    public static long differenceDays(Date dateOne, Date dateTwo) {
        long diff;
        if (dateOne.after(dateTwo)) {
            diff = dateOne.getTime() - dateTwo.getTime();
        }
        else {
            diff = dateTwo.getTime() - dateOne.getTime();
        }
        return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
    }


    public static long differenceSeconds(Date dateOne, Date dateTwo) {
        long diff;
        if (dateOne.after(dateTwo)) {
            diff = dateOne.getTime() - dateTwo.getTime();
        }
        else {
            diff = dateTwo.getTime() - dateOne.getTime();
        }
        return TimeUnit.SECONDS.convert(diff, TimeUnit.MILLISECONDS);
    }


    /**
     * Controlla se occorre o meno refreshare il prezzo di una coin
     *
     * Tempo previsto --> 300s --> 5 minuti
     *
     * @param lastUpdate
     * @return
     */
    public static boolean isToRefresh(Date lastUpdate) {
        //Se sono passati meno di cinque minuti (300 secondi) dall'ultimo upload di che occorre refreshare
        long differenceInSeconds = DateUtils.differenceSeconds(lastUpdate, new Date());
        return differenceInSeconds >= 300;
    }


    public static Date tomorrow() {
        return addUnit(new Date(), Calendar.DAY_OF_MONTH , 1);
    }

    public static LocalDateTime toLocalDateTime(Long tmst) {
        return LocalDateTime.ofInstant(
                Instant.ofEpochMilli(tmst),
                ZONE_ROME
        );
    }


}
