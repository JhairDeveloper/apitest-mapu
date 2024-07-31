const authService = require("../services/authService");
const { generateNewToken } = require("../helpers/tokenCreation");
const transporter = require("../configs/emailerConfig");

module.exports = {
  loginUser: async (req, res, next) => {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    if (user) {
      const payload = { id: user.id };
      const token = await generateNewToken(payload);

      return res.json({ user, token });
    }

    next({ status: 401, message: "Credenciales incorrectas" });
  },

  registerUser: async (req, res) => {
    const user = await authService.register(req.body);

    const payload = { id: user.id };
    const token = await generateNewToken(payload);

    return res.json({ user, token });
  },

  generatePasswordRecoveryToken: async (req, res) => {
    const { email } = req.body;
    const token = await authService.generatePasswordRecoveryToken(email);

    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
      <b>Haga click en el siguiente enlace o pégelo en su navegador web para la recuperación de contraseña</b>
      <a href="https://pis-mapu.vercel.app/recovery-password/${token}">https://pis-mapu.vercel.app/recovery-password/${token}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "Si la cuenta fue encontrada, el token se enviará a su email",
    });
  },

  recoverPassword: async (req, res, next) => {
    const token = req.body.token;
    const user = await authService.validateToken(token);

    user.password = await authService.hashPassword(req.body.newPassword);
    const newUser = await user.save();

    if (!newUser) {
      return next({
        status: 400,
        message: "No se ha podido recuperar la contraseña, intente más tarde",
      });
    }

    res.json({ message: "Contraseña actualizada exitosamente" });
  },
};
