/**
 * Configuração de Checkout & Venda da Oferta
 *
 * Plataforma: Stripe
 * Moeda: Euro (€)
 * Produtor / Marca: Mahila Luz
 */

export const CHECKOUT_CONFIG = {
  // Substitua pelo seu link de pagamento direto da Stripe (ex: https://buy.stripe.com/abc123xyz)
  stripeCheckoutUrl: "https://buy.stripe.com/SEU_LINK_STRIPE",

  // Moeda e precificação
  currency: "EUR",
  currencySymbol: "€",

  // Identidade da oferta
  brandName: "Mahila Luz",
  productName: "Ritual Numerológico",

  // Permite abrir o Stripe em nova aba ou na mesma página
  openInNewTab: false,
};
