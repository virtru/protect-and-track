const reactRouter = jest.genMockFromModule('react-router');

reactRouter.withRouter = (Component) => Component;

module.exports = reactRouter;
