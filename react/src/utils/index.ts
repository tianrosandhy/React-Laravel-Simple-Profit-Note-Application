const whatsappURL = (waNumber:string) => {
    if (waNumber.length == 0) {
        return "";
    }

    waNumber = waNumber.replace(/^[0-9]+$/g, "");

    const firstChar = waNumber.charAt(0);
    if (firstChar === "0") {
        waNumber = "62" + waNumber.substring(1);
    }
    return `https://wa.me/${waNumber}`;
}

const rupiah = (value:number|undefined|null) => {
    if (typeof value === 'undefined' || value === null) {
        return "Rp 0";
    }
    return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const dateToString = (date:Date) => {
    return date.toISOString().split('T')[0];
}

const humanReadableDate = (dateString: string) => {
    const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"
    ];

    if (dateString.length == 0) {
        return "";
    }    
    
    const date = new Date(dateString);
    const mo = monthNames[date.getMonth()];
    return `${date.getDate()} ${mo} ${date.getFullYear()}`;
};


export default { 
    whatsappURL,
    rupiah,
    dateToString,
    humanReadableDate,
};