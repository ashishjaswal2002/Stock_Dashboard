import express from "express";



export default class Routes {
  /**
   * @param  {Routes}
   * @returns void
   */
  static init(server) {
    const router = express.Router();

    server.app.use("/", router);

    /**
     * Entry point
     */
    server.app.get("/", (_, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<div><p><h2>App Server is working fine at ${envConfig.NODE_ENV} instance: ${envConfig.PORT}`
      );
    });
    let prefix = '/api/v1/admin';
    //Admin Router
    server.app.use(`${prefix}`,new AdminRouter().router);
    //Terms Policy Route


    /**
     * 404 if url not found
     */
    server.app.all("*", (_, res) => {
      res.status(process.env.NOT_FOUND).json({
        success: false,
        message: `API not found.`,
      });
    });

    // Static folder
    server.app.use("/", express.static("public"));
  }
}
