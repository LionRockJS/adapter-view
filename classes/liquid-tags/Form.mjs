export default {
  type: 'block',

  parse(token, remainTokens) {
    const args = token.args.split(',').map(x => x.trim());
    const type = args[0].replace(/(^')|('$)/gi, '');
    let form = '';
    // TODO form attributes
    const attributes = [];

    const inputs = [
      { name: 'form_type', type: 'hidden', value: 'block' },
      { name: 'utf8', type: 'hidden', value: '✓' },
    ];

    switch (type) {
      case 'activate_customer_password':
        form = 'action="https://my-shop.myshopify.com/account/activate"';
        break;
      case 'contact':
        form = 'action="/contact" class="contact-form"';
        break;
      case 'currency':
        // TODO: currency form
        break;
      case 'customer':
        form = 'action="/contact#contact_form" id="contact_form" class="contact-form"';
        break;
      case 'create_customer':
        form = 'action="https://my-shop.myshopify.com/account" id="create_customer"';
        break;
      case 'customer_address':
        form = 'action="/account/addresses/70359392" id="address_form_70359392"';
        break;
      case 'customer_login':
        form = 'action="https://my-shop.myshopify.com/account/login" id="customer_login"';
        break;
      case 'guest_login':
        form = 'action="https://my-shop.myshopify.com/account/login" id="customer_login_guest"';
        inputs.push({ name: 'guest', type: 'hidden', value: 'true' });
        inputs.push({ name: 'checkout_url', type: 'hidden', value: 'https://checkout.shopify.com/store-id/checkouts/session-id?step=contact_information' });
        break;
      case 'new_comment':
        form = 'action="/blogs/news/10582441-my-article/comments" class="comment-form" id="article-10582441-comment-form"';
        break;
      case 'product':
        form = 'action="/cart/add" enctype="multipart/form-data"';
        break;
      case 'recover_customer_password':
        form = 'action="/account/recover"';
        break;
      case 'reset_customer_password':
        form = 'action="https://my-shop.myshopify.com/account/account/reset" ';
        inputs.push({ name: 'token', type: 'hidden', value: '408b680ac218a77d0802457f054260b7-1452875227' });
        inputs.push({ name: 'id', type: 'hidden', value: '1080844568' });
        break;
      case 'storefront_password':
        form = 'action="/password" id="login_form" class="storefront-password-form"';
        break;
      default:
        form = '';
    }

    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        this.lead = `<form method="post" accept-charset="UTF-8" ${form} ${attributes.join(' ')}>\n${
          inputs.map(x => `<input name="${x.name}" type="${x.type}" value="${encodeURI(x.value)}"/>`).join('\n')
        }`;
      })
      .on('template', tpl => {
        this.templates.push(tpl);
      })
      .on('tag:endform', tpl => {
        this.trail = '</form>';
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  },

  * render(ctx, emitter) {
    emitter.write(this.lead);
    const r = this.liquid.renderer;
    yield r.renderTemplates(this.templates, ctx, emitter);
    emitter.write(this.trail);
  },
};
