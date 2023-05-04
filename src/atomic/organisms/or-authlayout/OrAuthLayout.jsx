import AtTypography from "../../atoms/at-typography"
import AtGrid from "../../atoms/at-grid"

const OrAuthLayout = ({ children, title = "" }) => {
  return (
    <AtGrid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.main", padding: 4 }}
    >
      <AtGrid
        item
        className="box-shadow"
        xs={3}
        sx={{
          width: { sm: 450 },
          backgroundColor: "primary.light",
          padding: 3,
          borderRadius: 2,
        }}
      >
        <AtTypography variant="h5" sx={{ mb: 1 }}>
          {title}
        </AtTypography>

        {children}
      </AtGrid>
    </AtGrid>
  )
}

export default OrAuthLayout
