/**
 * Data types that are supported by CIS scouting. Refer to the [MySQL docs](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)
 * for more information on the different data types
 */
enum DataType {
    TinyInt = "TINYINT",
    SmallInt = "SMALLINT",
    MediumInt = "MEDIUMINT",
    Int = "INT",
    TinyIntUnsigned = "TINYINT UNSIGNED",
    SmallIntUnsigned = "SMALLINT UNSIGNED",
    MediumIntUnsigned = "MEDIUMINT Unsigned",
    IntUnsigned = "INT Unsigned",
    Float = "FLOAT",
    TinyText = "TINYTEXT",
    Text = "TEXT",
    Bool = "BOOL",
    DateTime = "DATETIME",
    Points = "MULTIPOINT",
    Point = "POINT",
    /** A string that is formatted like an array with Ints in it*/
    IntArray = "TEXT",
    /** A string that is formatted like an array with Floats in it*/
    FloatArray = "TEXT",
}

/**
 * An object that holds all the functions that parse a raw string and convert it into the desired type. 
 */
const Parsers = {
    /**
     * A function that converts a string into a valid format that the MySQL database can handel
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Tiny Int.
     */
    parseTinyInt(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 7))
            number = Math.pow(2, 7) - 1;
        if (number < -Math.pow(2, 7))
            number = -Math.pow(2, 7);

        return number.toString();
    },
    /**
     * A function that converts a string into a valid SMALLINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Small Int.
     */
    parseSmallInt(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 15))
            number = Math.pow(2, 15) - 1;
        if (number < -Math.pow(2, 15))
            number = -Math.pow(2, 15);

        return number.toString();
    },
    /**
     * A function that converts a string into a valid MEDIUMINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Medium Int.
     */
    parseMediumInt(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 23))
            number = Math.pow(2, 23) - 1;
        if (number < -Math.pow(2, 23))
            number = -Math.pow(2, 23);

        return number.toString();
    },
    /**
     * A function that converts a string into a valid INT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Int.
     */
    parseInt(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 31))
            number = Math.pow(2, 31) - 1;
        if (number < -Math.pow(2, 31))
            number = -Math.pow(2, 31);

        return number.toString();
    },
    /**
     * A function that converts a string into a valid UNSIGNED TINYINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Unsigned Tiny Int.
     */
    parseTinyIntUnsigned(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 8))
            number = Math.pow(2, 8) - 1;
        if (number < 0)
            number = 0

        return number.toString();
    },
    /**
     * A function that converts a string into a valid UNSIGNED SMALLINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Unsigned Small Int.
     */
    parseSmallIntUnsigned(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 16))
            number = Math.pow(2, 16) - 1;
        if (number < 0)
            number = 0;

        return number.toString();
    },
    /**
     * A function that converts a string into a valid UNSIGNED MEDIUMINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Unsigned Medium Int.
     */
    parseMediumIntUnsigned(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 24))
            number = Math.pow(2, 24) - 1;
        if (number < 0)
            number = 0;

        return number.toString();
    },
    /**
     * A function that converts a string into a valid UNSIGNED INT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Unsigned Int.
     */
    parseIntUnsigned(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 32))
            number = Math.pow(2, 32) - 1;
        if (number < 0)
            number = 0;

        return number.toString();
    },
    /**
     * A function that converts a string into a valid FLOAT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Float.
     */
    parseFloat(input: string): string {
        let preliminaryFilter = input.match(/[0-9]*(\.[0-9]+)?/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        return preliminaryFilter;
    },
    /**
     * A function that converts a string into a valid TINYTEXT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Tiny Text.
     */
    parseTinyText(input: string): string {
        return input.replace(/\'/g, "''").substring(0, 255);
    },
    /**
     * A function that converts a string into a valid TEXT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Text.
     */
    parseText(input: string): string {
        return input.replace(/\'/g, "''").substring(0, 65535);
    },
    /**
     * A function that converts a string into a valid BOOLEAN format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Boolean.
     */
    parseBool(input: string): string {
        let preliminaryFilter = input.match(/true|false/i)?.[0];
        if (preliminaryFilter == null)
            preliminaryFilter = "false";
        preliminaryFilter = preliminaryFilter.toLowerCase();
        if (preliminaryFilter == "true")
            return "1";

        else
            return "0";
    },
    /**
     * A function that converts a string into a valid DATATIME format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Data Time.
     */
    parseDateTime(input: string): string {
        let preliminaryFilter = input.match(/[0-9]{4}-[01][0-9]-[0-3][0-9] [0-6][0-9]:[0-6][0-9]:[0-6][0-9]/)?.[0];
        if (preliminaryFilter == null) {
            let time = new Date();
            preliminaryFilter = getUTCDateTime();
        }
        return preliminaryFilter;
    },
    /**
     * A function that converts a string into a valid MULTIPOINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Multi-Point.
     */
    parsePoints(input: string): string {
        let preliminaryPoints = input.match(/([0-9]*(\.[0-9]+)|[0-9]),([0-9]*(\.[0-9]+)|[0-9])/g);
        if (preliminaryPoints == null)
            return "ST_MPointFromText('MULTIPOINT(0 0))";
        let points: string = "ST_MPointFromText(MULTIPOINT(";
        preliminaryPoints.forEach((value) => {
            points += value.replace(",", " ") + ", ";
        });
        points = points.replace(/, $/, "");
        points += ")')";
        return points;
    },
    /**
     * A function that converts a string into a valid POINT format that the MySQL database can handel.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Point.
     */
    parsePoint(input: string): string {
        let preliminaryPoint = input.match(/([0-9]*(\.[0-9]+)|[0-9]),([0-9]*(\.[0-9]+)|[0-9])/)?.[0];
        if (preliminaryPoint == null)
            return "ST_PointFromText('POINT(0 0)')";
        return `ST_PointFromText('POINT(${preliminaryPoint.replace(",", " ")})')`
    },
    /**
     * A function that converts a string into a valid IntArray format that can be parsed.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Int Array.
     */
    parseIntArray(input: string): string {
        let preliminaryInts = input.match(/[0-9]/g);
        if (preliminaryInts == null)
            return "[]";
        return `[${preliminaryInts.join(", ")}]`;
    },
    /**
     * A function that converts a string into a valid Float Array format that can be parsed.
     * @param input A raw string.
     * @returns A formatted string that can be converted into a Float Array.
     */
    parseFloatArray(input: string): string {
        let preliminaryInts = input.match(/[0-9]*(\.[0-9]+)?/g);
        if (preliminaryInts == null)
            return "[]";
        return `[${preliminaryInts.join(", ")}]`;
    },
    /**
     * A function that converts a string into a valid format that the MySQL database can handel.
     * @param input A raw string.
     * @param type The data type that the string should be formatted to.
     * @returns A formatted string that the database can convert.
     */
    parse(input: string, type: DataType) {
        switch (type) {
            case DataType.TinyInt:
                return this.parseTinyInt(input);

            case DataType.SmallInt:
                return this.parseSmallInt(input);

            case DataType.MediumInt:
                return this.parseMediumInt(input);

            case DataType.Int:
                return this.parseInt(input);

            case DataType.TinyIntUnsigned:
                return this.parseTinyIntUnsigned(input);

            case DataType.SmallIntUnsigned:
                return this.parseSmallIntUnsigned(input);

            case DataType.MediumIntUnsigned:
                return this.parseMediumIntUnsigned(input);

            case DataType.IntUnsigned:
                return this.parseIntUnsigned(input);

            case DataType.Float:
                return this.parseFloat(input);

            case DataType.TinyText:
                return this.parseTinyText(input);

            case DataType.Text:
                return this.parseText(input);

            case DataType.Bool:
                return this.parseBool(input);

            case DataType.DateTime:
                return this.parseDateTime(input);

            case DataType.Points:
                return this.parsePoints(input);

            case DataType.Point:
                return this.parsePoint(input);

            case DataType.IntArray:
                return this.parseIntArray(input);

            case DataType.FloatArray:
                return this.parseFloatArray(input);

            default:
                return this.parseText(input);
        }
    },

    /**
     * A helper function that takes in a type as a string as the database presents it and converts it to a {@link DataType}.
     * @param string A data type string as the MySQL database puts out.
     * @returns The matching data type if found.
     */
    parseDataType(string: string): DataType | null {
        switch (string.toLowerCase()) {
            case "tinyint":
                return DataType.TinyInt;
            case "tinyint unsigned":
                return DataType.TinyIntUnsigned;
            case "smallint":
                return DataType.SmallInt;
            case "smallint unsigned":
                return DataType.SmallIntUnsigned;
            case "mediumint":
                return DataType.MediumInt;
            case "mediumint unsigned":
                return DataType.MediumIntUnsigned;
            case "int":
                return DataType.Int;
            case "int unsigned":
                return DataType.IntUnsigned;
            case "float":
                return DataType.Float;
            case "tinytext":
                return DataType.TinyText;
            case "text":
                return DataType.Text;
            case "tinyint(1)":
                return DataType.Bool;
            case "datetime":
                return DataType.DateTime;
            case "multipoint":
                return DataType.Points;
            case "point":
                return DataType.Point;
            default:
                return null;
        }

    }
};

/**
 * A function that takes the current Coordinated Universal Time (UTC) and converts it to the MySQL DATETIME format.
 * @returns A string with the current date time in UTC.
 */
function getUTCDateTime(): string {
    let time = new Date();
    return `${time.getUTCFullYear().toString().padStart(4, "0")}-${(time.getUTCMonth() + 1).toString().padStart(2, "0")}-${time.getUTCDate().toString().padStart(2, "0")} ${time.getUTCHours().toString().padStart(2, "0")}:${time.getUTCMinutes().toString().padStart(2, "0")}:${time.getUTCSeconds().toString().padStart(2, "0")}`;
}


export { DataType, Parsers, getUTCDateTime }