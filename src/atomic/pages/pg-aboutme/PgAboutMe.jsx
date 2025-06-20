import React from "react"
import AtBox from "../../atoms/at-box"
import AtTypography from "../../atoms/at-typography"
import AtDivider from "../../atoms/at-divider"

const PgAboutMe = () => (
  <AtBox
    sx={{
      maxWidth: "80%",
      width: "100%",
      mx: "auto",
      mt: 4,
      mb: 3,
      p: { xs: 1, sm: 3 },
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      borderRadius: 4,
      boxShadow: 6,
      overflowWrap: "break-word",
      wordBreak: "break-word",
      overflowX: "hidden",
    }}
  >
    <AtTypography
      variant="h3"
      fontWeight={800}
      sx={{
        color: "primary.main",
        mb: 2,
        textAlign: "center",
        letterSpacing: 1,
      }}
    >
      About Me / <span style={{ color: "#1976d2" }}>Sobre mí</span>
    </AtTypography>
    <AtDivider sx={{ mb: 3 }} />
    <AtTypography
      variant="h5"
      fontWeight={700}
      sx={{ mb: 2, color: "text.primary" }}
    >
      Hello, I'm <b>Alexander Nova</b> —{" "}
      <span style={{ color: "#1976d2" }}>Senior Software Engineer</span> con más
      de <b>7 años de experiencia</b> desarrollando plataformas web y móviles
      para sectores como <b>defensa, banca, salud y tecnología</b>.
    </AtTypography>
    <AtTypography variant="body1" sx={{ mb: 2, color: "#333", fontSize: 18 }}>
      Mi enfoque ha sido construir soluciones robustas usando{" "}
      <b>React, React Native, Node.js, TypeScript</b> y tecnologías modernas
      como <b>Twilio, Azure y ElectronJS</b>.<br />
      <br />
      He trabajado como <b>Fullstack y Frontend Engineer</b> en empresas
      internacionales (<b>España, Chile, EE.UU, Colombia</b>) liderando
      desarrollos desde cero, integrando sistemas en tiempo real con sockets,
      optimizando experiencias de usuario y asegurando escalabilidad en
      arquitecturas modernas (<b>REST, SOLID, Hexagonal</b>).
    </AtTypography>
    <AtTypography variant="body1" sx={{ mb: 2, color: "#333", fontSize: 18 }}>
      Me apasiona explorar nuevas tecnologías, escalar productos y mantenerme
      actualizado con buenas prácticas. Trabajo cómodo con sistemas
      distribuidos, despliegues en <b>AWS/Docker</b>, testing automatizado y
      metodologías ágiles (<b>Scrum</b>).
    </AtTypography>
    <AtDivider sx={{ my: 3 }} />
    <AtTypography
      variant="body1"
      sx={{ fontSize: 18, color: "#1976d2", fontWeight: 700, mb: 1 }}
    >
      If you're building something meaningful that needs a solid technical
      backbone and creative frontend solutions — <b>I'm your guy.</b>
    </AtTypography>
  </AtBox>
)

export default PgAboutMe
