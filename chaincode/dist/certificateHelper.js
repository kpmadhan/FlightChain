"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CertificateHelper = /** @class */ (function () {
    function CertificateHelper() {
    }
    CertificateHelper.getIataCode = function (clientIdentity) {
        var iataCode = clientIdentity.getAttributeValue(CertificateHelper.ATTR_IATA_CODE); // .getAttributeValue(CertificateHelper.ATTR_IATA_CODE)
        console.log('CertificateHelper.getIataCode = ', iataCode);
        return iataCode;
    };
    CertificateHelper.ATTR_IATA_CODE = 'iata-code';
    return CertificateHelper;
}());
exports.CertificateHelper = CertificateHelper;
