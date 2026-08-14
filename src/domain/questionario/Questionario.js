/**
 * @typedef {Object} Questionario
 * @property {number} id
 * @property {{id: number}} gestante
 * @property {number} idade
 * @property {'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-'|'O+'|'O-'} tipoSanguineo
 * @property {number} semanaGestacional - 1 a 42
 * @property {'sim'|'nao'} primeiraGestacao
 * @property {string} dataPrevistaParto - ISO LocalDate
 * @property {'Nao'|'Hipertensao'|'Diabetes gestacional'|'Anemia'|'Outra'} condicaoSaude
 * @property {string|null} [condicaoSaudeOutra]
 * @property {'Sim'|'Ainda nao iniciei'|'Nao'} prenatalRegular
 * @property {'sim'|'nao'} possuiAlergia
 * @property {string|null} [alergiaEspecificacao]
 * @property {boolean} aceiteTermos
 * @property {string} dataPreenchimento - ISO LocalDateTime
 */

export {};
