# Placar Truco

Aplicativo de placar local para partidas de truco feito com Expo e React Native.

## Objetivo

O app foi pensado para funcionar como uma mesa de placar compartilhada em um unico aparelho, com foco em:

- marcacao rapida durante a partida;
- leitura visual forte para os dois times;
- historico local e retomada da mesa no mesmo aparelho.

## Stack

- Expo Router
- Expo SDK 55
- React 19
- React Native 0.83
- TypeScript
- Zustand
- AsyncStorage

## Como rodar

```bash
npm install
npm start
```

Atalhos uteis:

```bash
npm run android
npm run ios
npm run web
```

## Status atual

O projeto esta em fase de fechamento do MVP local.

Hoje o app ja funciona como placar local jogavel, com persistencia no aparelho e fluxo principal de partida fechado para uso em uma mesa compartilhada.

## Funcionalidades do MVP

- configuracao de variante, alvo de pontos, melhor de 1/3/5 e nomes dos times;
- placar local em um unico aparelho;
- tres estilos visuais de marcacao: carta, feijao e cristal;
- encerramento de queda e encerramento de partida com destaque visual;
- historico local dos principais eventos da mesa;
- desfazer da ultima acao elegivel;
- persistencia local com `AsyncStorage`.

## O que ainda nao esta implementado

- sincronizacao online;
- modo com 2 celulares;
- Firebase;
- login;
- regras novas de truco fora das configuracoes atuais.

## Observacao sobre o SDK

O projeto permanece no Expo SDK 55 nesta fase. Esta etapa do MVP nao inclui upgrade de SDK.

## Comandos uteis

```bash
npm run typecheck
npx expo-doctor
npm run lint
```

Observacao:
`npm run lint` depende de configuracao de ESLint no projeto. Se ela ainda nao existir, o comando pode falhar antes de rodar as regras.
