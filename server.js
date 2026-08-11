const express = require("express");

const app = express();

app.use(express.json());

const PORT =
  process.env.PORT || 3000;

const TURNSTILE_SECRET =
  process.env.TURNSTILE_SECRET;


/*
 * Cloudflare Turnstile verification.
 */

async function verifyTurnstile(
  token,
  remoteIP
) {

  if (
    !token ||
    typeof token !== "string"
  ) {
    return {
      success: false
    };
  }


  if (
    token.length > 2048
  ) {
    return {
      success: false
    };
  }


  const response =
    await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          secret:
            TURNSTILE_SECRET,

          response:
            token,

          remoteip:
            remoteIP

        })
      }
    );


  return await response.json();
}


/*
 * Verification endpoint.
 */

app.post(
  "/api/verify",
  async (req, res) => {

    try {

      const token =
        req.body.token;


      const remoteIP =
        req.headers[
          "cf-connecting-ip"
        ] ||
        req.headers[
          "x-forwarded-for"
        ] ||
        req.socket.remoteAddress;


      const result =
        await verifyTurnstile(
          token,
          remoteIP
        );


      if (!result.success) {

        console.log(
          "Turnstile failed:",
          result["error-codes"]
        );

        return res.status(403).json({

          success: false,

          error:
            "Cloudflare verification failed."

        });

      }


      /*
       * Turnstile passed.
       *
       * Put your actual protected
       * action here.
       */

      return res.json({

        success: true,

        message:
          "Verification successful."

      });


    } catch (error) {

      console.error(
        "Turnstile error:",
        error
      );


      return res.status(500).json({

        success: false,

        error:
          "Verification service unavailable."

      });

    }

  }
);


app.listen(
  PORT,
  () => {

    console.log(
      `Kn4ght Security API running on port ${PORT}`
    );

  }
);
