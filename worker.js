const ALLOWED_ORIGIN =
  "https://kn4ght-security.github.io";

const EXPECTED_HOSTNAME =
  "kn4ght-security.github.io";

const EXPECTED_ACTION =
  "kn4ght_verify";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin)
      });
    }

    // Only allow POST verification
    if (
      new URL(request.url).pathname === "/api/verify"
    ) {
      if (request.method !== "POST") {
        return json(
          {
            success: false,
            error: "Method not allowed."
          },
          405,
          origin
        );
      }

      return verifyTurnstile(
        request,
        env,
        origin
      );
    }

    return json(
      {
        success: false,
        error: "Not found."
      },
      404,
      origin
    );
  }
};


/*
 * Verify Cloudflare Turnstile
 */
async function verifyTurnstile(
  request,
  env,
  origin
) {
  try {
    // Only accept requests from your website.
    if (origin !== ALLOWED_ORIGIN) {
      return json(
        {
          success: false,
          error: "Origin not allowed."
        },
        403,
        origin
      );
    }

    if (!env.TURNSTILE_SECRET) {
      console.error(
        "TURNSTILE_SECRET is not configured."
      );

      return json(
        {
          success: false,
          error: "Server configuration error."
        },
        500,
        origin
      );
    }

    const body =
      await request.json();

    const token =
      body?.token;

    // Validate token format.
    if (
      typeof token !== "string" ||
      token.length === 0 ||
      token.length > 2048
    ) {
      return json(
        {
          success: false,
          error: "Invalid Turnstile token."
        },
        400,
        origin
      );
    }

    const clientIP =
      request.headers.get(
        "CF-Connecting-IP"
      ) || "";


    /*
     * Send token to Cloudflare.
     */
    const verifyResponse =
      await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          },

          body:
            new URLSearchParams({
              secret:
                env.TURNSTILE_SECRET,

              response:
                token,

              remoteip:
                clientIP
            })
        }
      );


    if (!verifyResponse.ok) {
      console.error(
        "Turnstile Siteverify HTTP error:",
        verifyResponse.status
      );

      return json(
        {
          success: false,
          error:
            "Turnstile verification service unavailable."
        },
        502,
        origin
      );
    }


    const result =
      await verifyResponse.json();


    /*
     * Turnstile failed.
     */
    if (!result.success) {

      console.log(
        "Turnstile rejected token:",
        result["error-codes"] || []
      );

      return json(
        {
          success: false,
          error:
            "Cloudflare verification failed."
        },
        403,
        origin
      );
    }


    /*
     * Make sure the token came from
     * the expected action.
     *
     * IMPORTANT:
     * Your Turnstile widget should have:
     *
     * data-action="kn4ght_verify"
     */
    if (
      result.action &&
      result.action !== EXPECTED_ACTION
    ) {
      return json(
        {
          success: false,
          error:
            "Invalid verification action."
        },
        403,
        origin
      );
    }


    /*
     * Make sure the token was generated
     * for your website hostname.
     */
    if (
      result.hostname &&
      result.hostname !== EXPECTED_HOSTNAME
    ) {
      return json(
        {
          success: false,
          error:
            "Invalid verification hostname."
        },
        403,
        origin
      );
    }


    /*
     * Success.
     */
    return json(
      {
        success: true,
        verified: true,
        message:
          "Kn4ght Security verification successful."
      },
      200,
      origin
    );

  } catch (error) {

    console.error(
      "Worker error:",
      error
    );

    return json(
      {
        success: false,
        error:
          "Verification server error."
      },
      500,
      origin
    );
  }
}


/*
 * JSON response helper
 */
function json(
  data,
  status = 200,
  origin = null
) {
  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        "Content-Type":
          "application/json",

        ...corsHeaders(origin)
      }
    }
  );
}


/*
 * CORS headers
 */
function corsHeaders(origin) {

  const allowed =
    origin === ALLOWED_ORIGIN
      ? ALLOWED_ORIGIN
      : "null";

  return {
    "Access-Control-Allow-Origin":
      allowed,

    "Access-Control-Allow-Methods":
      "POST, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type",

    "Access-Control-Max-Age":
      "86400"
  };
}
