using PayPalCheckoutSdk.Orders;
using Models;
using PayPalCheckoutSdk.Core;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class PaypalController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
     public PaypalController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
    }
    [HttpPost("MakePayment/{easyChairID}")]
    public async Task<ActionResult> MakePayment(int easyChairID)
    {
        try
        {
            string ClientId = configuration.GetSection("PaypalOptions:ClientID").Value!;
            string Secret = configuration.GetSection("PaypalOptions:ClientSecret").Value!;
            string Mode = configuration.GetSection("PaypalOptions:Mode").Value!;
            var easyChair = await Context.Lezaljke.FindAsync(easyChairID);
            if (easyChair == null)
                return BadRequest("Lezaljka nije nadjena");

            double amount = easyChair.Cena; // Cena ležaljke
            // Konfiguracija Paypala
            var environment = new SandboxEnvironment(ClientId , Secret);
            var client = new PayPalHttpClient(environment);

            // Kreiranje narudzbine
            var order = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                ApplicationContext = new ApplicationContext()
                {
                    BrandName = "WAZAP",
                    LandingPage = "LOGIN",
                    UserAction = "PAY_NOW",
                    ReturnUrl = "http://localhost:5173",
                    CancelUrl = "http://localhost:5173/login"
                },
                PurchaseUnits = new List<PurchaseUnitRequest>()
                {
                    new PurchaseUnitRequest()
                    {
                        AmountWithBreakdown = new AmountWithBreakdown()
                        {
                            CurrencyCode = "USD",
                            Value = amount.ToString()
                        }
                    }
                }
            };

            // Kreirajte narudžbinu preko PayPal API-ja
            var request = new OrdersCreateRequest();
            request.Prefer("return=representation");
            request.RequestBody(order);
            var response = await client.Execute(request);
            var statusCode = response.StatusCode;

            if (statusCode == HttpStatusCode.Created)
            {
                // Ako je narudžbina uspešno kreirana, dobijemo informacije o njoj
                var result = response.Result<Order>();
                // Uzmite URL za plaćanje iz odgovora
                var approvalUrl = result.Links.First(link => link.Rel == "approve").Href;

                // Preusmerite korisnika na PayPal stranicu za plaćanje
                return Ok(approvalUrl);
            }
            else
            {
                // Ako postoji greška prilikom kreiranja narudžbine, vratite odgovarajući status kod
                return StatusCode((int)statusCode, "Neuspela kreacija narudžbine");
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}