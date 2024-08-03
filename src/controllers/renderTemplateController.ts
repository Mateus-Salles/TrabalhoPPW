import { Request, Response } from "express";

export class RenderTemplateController {
  static async renderPage(request: Request, response: Response) {
    const query = request.query.side;

    if (!query) {
      return response.status(400).send();
    }

    const side = query.toString();

    if (side !== "back" && side !== "front") {
      return response.status(400).send();
    }

    const renderPageSide = `components/paper/${side}`;

    response.render(
      renderPageSide,
      { page: { body: null, id: null } },
      (err, html) => {
        if (err) {
          console.error(err);
          return response.status(500).send(err.message);
        }

        return response.send(html);
      }
    );
  }

  static async renderSelfInfo(request: Request, response: Response) {
    const user = request.user;

    return response.render("components/self-info", { user }, (err, html) => {
      if (err) {
        console.error(err);
        return response.status(500).send(err.message);
      }

      return response.send(html);
    });
  }

  // static async renderComponent(request: Request, response: Response) {
  //   const component = request.query.component;
  //   const type = request.query.type;

  //   if (!component) {
  //     return response.status(400).send()
  //   }

  //   return response.render(`components/${component}`)
  // }
}
