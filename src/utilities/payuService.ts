const PAYU_BASE_URL =
  "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"; // URL de sandbox de PayU
const API_KEY = "4Vj8eK4rloUd272L48hsrarnUA";
const API_LOGIN = "pRRXKOl8ikMmt9u";
const MERCHANT_ID = "508029";
const ACCOUNT_ID = "512321";

export const payWithPayU = async (paymentData: any) => {
  const payload = {
    language: "es",
    command: "SUBMIT_TRANSACTION",
    merchant: {
      API_KEY,
      API_LOGIN,
    },
    transaction: {
      order: {
        ACCOUNT_ID,
        referenceCode: "payment_test_00000001",
        description: "Prueba",
        language: "es",
        signature: generateSignature(paymentData), // Genera la firma según la documentación de PayU
        notifyUrl: "http://www.tes.com/confirmation",
        additionalValues: {
          TX_VALUE: {
            value: "10000",
            currency: "COP",
          },
        },
        buyer: {
          merchantBuyerId: "1",
          fullName: "Test User",
          emailAddress: "test@test.com",
          contactPhone: "7563126",
          dniNumber: "123456789",
          shippingAddress: {
            street1: "Calle 93B No. 13-48",
            street2: "Apto 301",
            city: "Bogotá",
            state: "Bogotá D.C.",
            country: "CO",
            postalCode: "000000",
            phone: "7563126",
          },
        },
        shippingAddress: {
          street1: "Calle 93B No. 13-48",
          street2: "Apto 301",
          city: "Bogotá",
          state: "Bogotá D.C.",
          country: "CO",
          postalCode: "0000000",
          phone: "7563126",
        },
      },
      payer: {
        merchantPayerId: "1",
        fullName: "Test User",
        emailAddress: "payer_test@test.com",
        contactPhone: "7563126",
        dniNumber: "123456789",
        billingAddress: {
          street1: "Calle 93B No. 13-48",
          street2: "Apto 301",
          city: "Bogotá",
          state: "Bogotá D.C.",
          country: "CO",
          postalCode: "000000",
          phone: "7563126",
        },
      },
      creditCard: {
        number: "4097440000000004",
        securityCode: "777",
        expirationDate: "05/2025",
        name: "APPROVED",
      },
      extraParameters: {
        INSTALLMENTS_NUMBER: 1,
      },
      type: "AUTHORIZATION_AND_CAPTURE",
      paymentMethod: "VISA",
      paymentCountry: "CO",
      deviceSessionId: "vghs6tvkcle931686k1900o6e1",
      ipAddress: "127.0.0.1",
      cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
      userAgent:
        "Mozilla/5.0 (Windows NT 5.1; rv:40.0) Gecko/20100101 Firefox/40.1",
    },
    test: true,
  };

  try {
    const response = await fetch(PAYU_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error processing payment with PayU", error);
    throw error;
  }
};

const generateSignature = (paymentData: any) => {
  // Implementa la lógica para generar la firma según las especificaciones de PayU
  // Esto generalmente implica usar el API_KEY, MERCHANT_ID y detalles de la transacción
  return "firma_generada";
};
